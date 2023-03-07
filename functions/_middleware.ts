interface Env {
  KV: KVNamespace;
}

const appConfig = require('./app-config.json') as AppConfig
const oneDayInSeconds = 60 * 60 * 24
const passwordKey = "password"

type AppConfig = {
  sites: SiteConfig[]
  allowedCountries?: string[]
}

type SiteConfig = {
  slug: string,
  passwordHash: string,
  live?: boolean,
  signInExpiryInDays?: number,
  activateOn: string,
  deactivateOn: string,
}

type MiddlewareEnv = Env & {
  ASSETS: {
    fetch: (input: RequestInfo, init?: RequestInit<RequestInitCfProperties>) => Promise<Response>;
  };
}

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  try {
    const url = new URL(request.url);
    const siteSlug = url.pathname.split("/")[1]
    const config = appConfig.sites.filter(x => x.slug == siteSlug).at(0)
    const cookiePassword = decodeURI(getCookie(request, siteSlug) ?? "")

    if (config == null) return NotFound(env, url)
    
    if (isEarly(config)) return Early(env, url)
    
    if (config.live === false || isLate(config)) return Closed(env, url)
    
    if (config.passwordHash != cookiePassword) return await Login(env, url, config);
    console.log("here")

    return next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}

async function Login(env: MiddlewareEnv, url: URL, config: SiteConfig) {
  const hasPassword = url.searchParams.has(passwordKey)
  const password = decodeURI(url.searchParams.get(passwordKey) ?? "").replaceAll("+", " ")
  const passwordHash = await hash(`${config.slug}:${password}`)
  
  url.searchParams.delete(passwordKey)

  if (!hasPassword) {
    url.pathname = '/_internal/login'
    return env.ASSETS.fetch(url)
  }

  if (config.passwordHash !== passwordHash) {
    url.searchParams.append("error", "Incorrect password.");
    console.log(url)
    return Response.redirect(url.href)
  }

  const response = Response.redirect(url.href).clone()
  setCookie(response, config.slug, passwordHash, (config.signInExpiryInDays ?? 1) * oneDayInSeconds)
  return response
}

function NotFound(env: MiddlewareEnv, url: URL) {
  url.pathname = '/_internal/404'
  return env.ASSETS.fetch(url)
}

function Early(env: MiddlewareEnv, url: URL) {
  url.pathname = '/_internal/early'
  return env.ASSETS.fetch(url)
}

function Closed(env: MiddlewareEnv, url: URL) {
  url.pathname = '/_internal/closed'
  return env.ASSETS.fetch(url)
}

function ServerError(env: MiddlewareEnv, url: URL) {
  url.pathname = '/_internal/500'
  return env.ASSETS.fetch(url)
}

function getCookie(request: Request, key: string): string | null {
  const header = request.headers.get("cookie")
  if (!header) return null

  const matchingCookies = header.split(";").map(x => x.trim().split("=")).filter(x => x[0].trim() == key)
  if (!matchingCookies) return null

  return matchingCookies[0][1].trim()
}

function setCookie(response: Response, key: string, value: string, maxAge: number) {
  const newCookie = `${key}=${value}; path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=true`

  const header = response.headers.get("Set-Cookie")
  if (!header) {
    response.headers.append("Set-Cookie", newCookie)
  } else {
    response.headers.set("Set-Cookie", [header, newCookie].join("; "))
  }

}

async function hash(text: string) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex;
}

function isEarly(config: SiteConfig) {
  if (config.activateOn === undefined) return false

  const date = Date.parse(config.activateOn)

  if (date === Number.NaN) return false

  return date > Date.now()
}

function isLate(config: SiteConfig) {
  if (config.deactivateOn === undefined) return false

  const date = Date.parse(config.deactivateOn)

  if (date === Number.NaN) return false

  return date < Date.now()
}
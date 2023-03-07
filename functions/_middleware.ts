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
  const url = new URL(request.url);
  try {
    const siteSlug = url.pathname.split("/")[1]
    const config = appConfig.sites.filter(x => x.slug == siteSlug).at(0)
    const cookiePassword = decodeURI(getCookie(request, siteSlug) ?? "")

    if (config == null) return NotFound(env, url)
    
    if (isEarly(config)) return Early(env, url)
    
    if (config.live === false || isLate(config)) return Closed(env, url)
    
    if (config.passwordHash != cookiePassword) return await Login(env, request, config);

    return next();
  } catch (err) {
    return await ServerError(env, url, err)
  }
}

async function Login(env: MiddlewareEnv, request: Request, config: SiteConfig) {
  const url = new URL(request.url);
  url.searchParams.delete("error")
  
  if (request.method !== "POST") {
    url.pathname = '/_internal/login'
    return env.ASSETS.fetch(url)
  }
  
  const password = decodeURI((await request.formData()).get(passwordKey) ?? "").replaceAll("+", " ")
  const passwordHash = await hash(`${config.slug}:${password}`)

  if (password === "") {
    url.pathname = '/_internal/login'
    return env.ASSETS.fetch(url)
  }
  
  if (config.passwordHash !== passwordHash) {
    url.searchParams.append("error", "Incorrect password.");
    return Response.redirect(url.href)
  }

  const newCookie = `${config.slug}=${passwordHash}; path=/; Max-Age=${(config.signInExpiryInDays ?? 1) * oneDayInSeconds}; Secure; HttpOnly; SameSite=true`
  return new Response(null, { status: 302, headers: { location: url.href, "Set-Cookie": newCookie }})
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

async function ServerError(env: MiddlewareEnv, url: URL, err: any) {
  url.pathname = '/_internal/500'
  const assetResponse = await env.ASSETS.fetch(url)
  return new Response(assetResponse.body, { status: 500, headers: { error: err }})
}

function getCookie(request: Request, key: string): string | null {
  const header = request.headers.get("cookie")
  if (!header) return null

  const matchingCookies = header.split(";").map(x => x.trim().split("=")).filter(x => x[0].trim() == key)
  console.log(matchingCookies)
  if (matchingCookies.length === 0) return null

  return matchingCookies[0][1].trim()
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
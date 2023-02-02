import { NextRequest, NextResponse } from 'next/server'

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
  signInExpriyInDays?: number,
  activateOn: string,
  deactivateOn: string,
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|global.css).*)'],
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const siteSlug = url.pathname.split("/")[1]
  const config = appConfig.sites.filter(x => x.slug == siteSlug).at(0)
  const cookiePassword = decodeURI(request.cookies.get(siteSlug)?.value ?? "")

  if (isGeoBlocked(appConfig, request.geo?.country)) return GeoBlocked(url);

  if (config == null) return NotFound(url)

  if (isEarly(config)) return Early(url)

  if (config.live === false ||  isLate(config)) return Closed(url)

  if (config.passwordHash != cookiePassword) return await Login(url, config);

  if (url.pathname == `/${siteSlug}`) return SiteIndex(url);

  return NextResponse.next()
}

async function Login(url: URL, config: SiteConfig) {
  const hasPassword = url.searchParams.has(passwordKey)
  const password = decodeURI(url.searchParams.get(passwordKey) ?? "").replaceAll("+", " ")
  const passwordHash = await hash(`${config.slug}:${password}`)
  
  url.searchParams.delete(passwordKey)

  if (!hasPassword) {
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }

  if (config.passwordHash !== passwordHash) {
    url.searchParams.append("error", "Incorrect password.");
    return NextResponse.redirect(url)
  }

  const response = NextResponse.redirect(url)
  response.cookies.set(config.slug, passwordHash, { 
    httpOnly: true, 
    maxAge: (config.signInExpriyInDays ?? 1) * oneDayInSeconds, 
    sameSite: true, 
    secure: true,
  })
  return response
}

function NotFound(url: URL) {
  url.pathname = '/404'
  return NextResponse.rewrite(url)
}

function Early(url: URL) {
  url.pathname = '/early'
  return NextResponse.rewrite(url)
}

function Closed(url: URL) {
  url.pathname = '/closed'
  return NextResponse.rewrite(url)
}

function GeoBlocked(url: URL) {
  url.pathname = '/geoblocked'
  return NextResponse.rewrite(url)
}

function SiteIndex(url: URL) {
  url.pathname += '/index.html'
  return NextResponse.redirect(url)
}

async function hash(text: string) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex;
}

function isGeoBlocked(config: AppConfig, country?: string) {
  if (config.allowedCountries === undefined) return false

  return !config.allowedCountries.includes(country ?? "");
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


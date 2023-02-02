import { NextRequest, NextResponse } from 'next/server'

const appConfig = require('./app-config.json') as AppConfig
const oneDayInSeconds = 60 * 60 * 24
const passwordKey = "password"

type AppConfig = {
  projects: ProjectConfig[]
}

type ProjectConfig = { 
  slug: string,
  passwordHash: string,
  live?: boolean,
  signInExpriyInDays?: number
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|global.css).*)'],
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const project = url.pathname.split("/")[1]
  const config = appConfig.projects.filter(x => x.slug == project).at(0)

  if (config == null)
    return NotFound(url)

  if (config.live === false)
    return NotFound(url)

  const cookiePassword = decodeURI(request.cookies.get(project)?.value ?? "")

  if (config.passwordHash != cookiePassword)
    return await Login(url, config);

  if (url.pathname == `/${project}`)
    return ProjectIndex(url);

  return NextResponse.next()
}

function NotFound(url: URL) {
  url.pathname = '/404'
  return NextResponse.rewrite(url)
}

function ProjectIndex(url: URL) {
  url.pathname += '/index.html'
  return NextResponse.redirect(url)
}

async function Login(url: URL, config: ProjectConfig) {
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

async function hash(text: string) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex;
}
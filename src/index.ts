import { NextURL } from "next/dist/server/web/next-url"
import { NextRequest, NextResponse } from "next/server"


type MiddlewareFunction = (req:NextRequest, res:NextResponse) => Promise<boolean | NextResponse | void>
type Matchers = RegExp | string;

type MiddlewareConfigValue = { relMatchers?: Matchers[]; absMatchers?: Matchers[] } | "*"
type MiddlewareConfigItem = [MiddlewareFunction, MiddlewareConfigValue]

export type MiddlewareListConfig = MiddlewareConfigItem[]


function testForMatches(config:Matchers[], url:string) {
  let didMatch = false
  for (let relIndex in config) {
    let relMatch = config[relIndex]

    if ( relMatch instanceof RegExp ) {
      relMatch = RegExp(`^${relMatch.source}$`, relMatch.flags)
      if (relMatch.test(url)) {didMatch = true; break}
    }

    else if( (typeof(relMatch) == "string") && (relMatch == url) ) {didMatch = true; break}
  }

  return didMatch
}

function passesMatchersCriteria(nextUrl:NextURL, matchersConfig:MiddlewareConfigValue) {
  // match anything
  if (matchersConfig === "*") return true
  
  // relative matches
  let relMatchersConfig = matchersConfig?.relMatchers
  if (relMatchersConfig) {
    let relativeMatches = testForMatches(relMatchersConfig, nextUrl.pathname)
    if (relativeMatches) return true
  }

  // absolute matches
  let absMatchersConfig = matchersConfig?.absMatchers
  if (absMatchersConfig) {
    let absoluteMatches = testForMatches(absMatchersConfig, nextUrl.href)
    if (absoluteMatches) return true
  }
}

export function withMiddlewareList(middlewareConfig: MiddlewareListConfig) {
  return async function middleware(req:NextRequest) {
    let res = NextResponse.next()
    let url = req.url

    for (let [func, matchersConfig] of middlewareConfig) {
      if (!passesMatchersCriteria(req.nextUrl, matchersConfig)) continue

      let terminate = await func(req, res) as unknown
      if (terminate) return terminate instanceof NextResponse ? terminate : undefined
    }
  
    return res
  }
}
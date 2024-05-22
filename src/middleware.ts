// inside src folder
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === "production" && request.nextUrl.protocol === 'http:') {
        return NextResponse.redirect(new URL('/', 'https://'+request.nextUrl.host))
    }
}
 
export const config = {
    // match every path
    matcher: '/(.*)',
}
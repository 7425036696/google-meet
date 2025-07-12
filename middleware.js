import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl
  console.log("pathana,e,", pathname, "token", token)

  // ✅ 1. Redirect authenticated users away from /user-auth
  if (pathname === "/user-auth" && token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // ✅ 2. Redirect unauthenticated users trying to access anything except /user-auth
  if (!token && pathname !== "/user-auth") {
    return NextResponse.redirect(new URL("/user-auth", req.url))
  }

  // ✅ 3. Allow normal access
  return NextResponse.next()
}

// ✅ 4. Matcher must include all paths you want middleware to run on
export const config = {
  matcher: ["/", "/user-auth", "/dashboard/:path*", "/profile/:path*"], // add more protected routes
}

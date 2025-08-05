import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook",
  "/sign-in",
  "/sign-up",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  if (userId && req.nextUrl.pathname === "/") {
    if (userId) {
      if (orgId) {
        return NextResponse.redirect(new URL(`/team/${orgId}`, req.url));
      } else {
        return NextResponse.redirect(new URL("/select-team", req.url));
      }
    }
    return NextResponse.next();
  }

  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("returnBackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

   return NextResponse.next();
});


export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|svg|ico|woff2?|eot|ttf|woff|json|bmp|pdf|csv|zip)).*)',
    '/board(.*)',    
    '/(api|trpc)(.*)',
  ],
};
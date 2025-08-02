import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|svg|ico|woff2?|eot|ttf|woff|json|bmp|pdf|csv|zip)).*)',
    '/(api|trpc)(.*)',
  ],
};
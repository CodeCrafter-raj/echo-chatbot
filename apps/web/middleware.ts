import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { use } from 'react';

const publicRoutes = createRouteMatcher([
  '/', // Public home page
  '/sign-in(.*)', // Sign-in page and its subpaths
  '/sign-up(.*)', // Sign-up page and its subpaths
  '/test', // Test page
]);

const isOrgFreeRoute= createRouteMatcher([
   '/', // Public home page
  '/sign-in(.*)', // Sign-in page and its subpaths
  '/sign-up(.*)', // Sign-up page and its subpaths
  '/org-selection(.*)', // Org selection page and its subpaths
]);


export default clerkMiddleware(async (auth, req) => {

  const {userId, orgId} =  await auth();

  if (!publicRoutes(req)) {
    await auth.protect();
  } 

  if(userId && !orgId && !isOrgFreeRoute(req)){
    const searchParams=new URLSearchParams({redirectUrl: req.url});

    const  orgSelection=new URL(`/org-selection?${searchParams.toString()}`, req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
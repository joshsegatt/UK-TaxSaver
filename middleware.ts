import { stackServerApp } from "./stack";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
    // Note: Stack Auth authentication is handled primarily in Server Components and Server Actions
    // using `stackServerApp.getUser()`. This middleware serves as a placeholder for future
    // edge-level protections or redirects if needed.
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

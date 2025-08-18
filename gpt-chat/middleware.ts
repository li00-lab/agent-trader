import { NextResponse } from "next/server";

export function middleware(request: any) {
  console.log(request);
  return NextResponse.next();
}

export const config = {
  matcher: "/news",
};

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";

  console.log("[Auth Callback] Received request. URL:", request.url);
  console.log("[Auth Callback] Code present:", !!code, "Next target:", next);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error("[Auth Callback] Error: Supabase env variables missing");
    return NextResponse.redirect(
      new URL("/login?error=auth_not_configured", request.url)
    );
  }

  if (code) {
    const redirectUrl = new URL(next, request.url);
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    console.log("[Auth Callback] Exchanging code for session...");
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[Auth Callback] exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }
    console.log("[Auth Callback] Session exchange successful! Redirecting to:", redirectUrl.toString());
    return response;
  }

  console.log("[Auth Callback] No code provided. Redirecting to:", next);
  return NextResponse.redirect(new URL(next, request.url));
}
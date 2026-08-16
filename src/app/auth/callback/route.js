import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                });
              } catch (err) {
                console.warn("[Auth Callback] Warning: Failed to set cookies in setAll:", err.message);
              }
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
      console.log("[Auth Callback] Session exchange successful! Redirecting to:", next);
      
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    } catch (err) {
      console.error("[Auth Callback] Unexpected error during exchange:", err);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(err.message || "unexpected_error")}`, request.url)
      );
    }
  }

  console.log("[Auth Callback] No code provided. Redirecting to:", next);
  return NextResponse.redirect(new URL(next, request.url));
}
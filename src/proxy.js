import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/template/",
  "/dashboard",
  "/analysis",
];

const PUBLIC_ROUTES = [
  "/",
  "/template",
  "/login",
  "/upload",
  "/auth",
  "/pricing",
];

export async function proxy(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const needsAuth =
    PROTECTED_ROUTES.some(
      (r) => path.startsWith(r) && path !== "/template" && path !== "/template/"
    ) || (path.startsWith("/template/") && path !== "/template");

  if (needsAuth && !data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (path === "/login" && data.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|template-previews|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};



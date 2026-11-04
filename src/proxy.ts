import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pidan_session";

/**
 * Redirection optimiste : sans cookie de session, on renvoie vers la connexion
 * avant même de rendre la page. La vérification réelle a lieu dans chaque page et action admin.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !hasCookie) {
    const url = new URL("/admin/login", request.nextUrl);
    url.searchParams.set("suite", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname === "/admin/login" && hasCookie) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

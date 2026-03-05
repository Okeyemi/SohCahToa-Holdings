import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect /dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // No tokens = redirect to login
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Simulate token expiry check (in production, decode JWT)
  // For demo: tokens expire after 60 seconds
  const tokenTimestamp = request.cookies.get('tokenTimestamp')?.value;
  if (tokenTimestamp) {
    const elapsed = Date.now() - parseInt(tokenTimestamp);
    if (elapsed > 60000) { // 60 seconds
      // Token expired - let client handle refresh
      // Middleware cannot make async calls to refresh endpoint
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};

/*
MIDDLEWARE LIMITATIONS EXPLAINED:

1. EDGE RUNTIME CONSTRAINTS:
   - Cannot use Node.js APIs (fs, crypto, etc.)
   - Cannot make database calls
   - Cannot use most npm packages
   - Limited to Web APIs only

2. NO ASYNC OPERATIONS:
   - Cannot call refresh token endpoint
   - Cannot validate JWT signatures with crypto
   - Cannot fetch user data from database
   - Must delegate complex auth to client/server

3. REDIRECT SAFETY:
   - Always use absolute URLs with request.url as base
   - Avoid redirect loops by checking pathname first
   - Use NextResponse.redirect() not Response.redirect()
   - Test redirect behavior in production (different from dev)

4. COOKIE LIMITATIONS:
   - Can read cookies but complex parsing is limited
   - Cannot decrypt secure cookies in middleware
   - HttpOnly cookies readable but not modifiable
   - SameSite enforcement varies by environment

5. PERFORMANCE CONSIDERATIONS:
   - Runs on every request to matched routes
   - Keep logic minimal and fast
   - Avoid complex computations
   - Cache-friendly operations only

SECURITY TRADE-OFFS:
- Basic token presence check only
- Real validation happens in API routes
- Client handles token refresh logic
- Middleware provides first line of defense
*/
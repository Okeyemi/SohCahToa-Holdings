SohCahToa Holdings — Frontend Assessment

A secure transaction monitoring dashboard built with Next.js 16, TypeScript, and modern React patterns.

This project demonstrates authentication, role-based access control, real-time updates, secure API design, and middleware route protection using a production-style frontend architecture.
##  Quick Start

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

##  Test Credentials

**Admin User:**
- Email: `admin@sohcahtoa.com`
- Password: `admin123`

**Analyst User:**
- Email: `analyst@sohcahtoa.com`
- Password: `analyst123`

##  Architecture

### Task 1: Figma UI Conversion
- **Route:** `/fx-dashboard`
- Pixel-perfect conversion of provided Figma designs
- Modern responsive UI components

### Task 2: Secure Transaction Dashboard
- **Route:** `/dashboard` (protected)
- Full authentication flow with middleware
- Real-time updates via Server-Sent Events
- Role-based access control

##  Security Features

- **XSS Prevention:** All user input sanitized
- **CSRF Protection:** SameSite cookies + httpOnly
- **Token Management:** Secure cookie-based auth
- **Auto-refresh:** Seamless token renewal
- **Data Masking:** Sensitive fields protected

##  Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit + RTK Query
- **Auth:** Cookie-based with middleware
- **Real-time:** Server-Sent Events

##  Key Features

### Authentication
- Secure login/logout flow
- Automatic token refresh
- Middleware route protection
- Session management

### Dashboard
- Server-side pagination & filtering
- Real-time transaction updates
- Role-based admin actions
- Optimistic UI updates

### Security
- XSS attack prevention
- Sensitive data masking
- Secure token handling
- CSRF mitigation

### XSS Mitigation Strategy
**Test Case:** Transaction ID 6 contains `<script>alert("xss")</script>`

**Protection Mechanism:**
1. **React's Default Escaping:** React/Next automatically escapes all text content rendered via JSX expressions `{value}`. HTML special characters are converted to entities:
   - `<` becomes `&lt;`
   - `>` becomes `&gt;`
   - `"` becomes `&quot;`

2. **What We Avoid:**
   -  `dangerouslySetInnerHTML` - bypasses React's protection
   - Direct DOM manipulation with `innerHTML`
   - `eval()` or `Function()` constructors

3. **Where XSS Payload Appears:**
   - Transaction table description column
   - Transaction detail panel
   - Both render as plain text: `<script>alert("xss")</script>` (visible but not executed)

4. **Additional Safeguards:**
   - All API inputs validated and typed
   - HttpOnly cookies prevent XSS token theft

## API Routes

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/refresh` - Token renewal
- `GET /api/transactions` - Paginated data
- `GET /api/transactions/stream` - Real-time updates
- `POST /api/transactions/flag` - Admin actions

## Caching Strategy

**My Choice:** `cache: "no-store"` used it for  all transaction endpoints



##  Middleware Implementation

### Route Protection
Middleware protects all `/dashboard/*` routes by:
- Checking for `accessToken` and `refreshToken` cookies
- Validating token timestamp (60-second expiry simulation)
- Redirecting unauthenticated users to `/login`
- Using safe absolute URL redirects

### Middleware Limitations
**Edge Runtime Constraints:**
- Cannot use Node.js APIs or most npm packages
- No database calls or complex crypto operations
- Limited to basic cookie reading and URL manipulation

**Async Operation Restrictions:**
- Cannot call refresh token endpoint directly
- Cannot validate JWT signatures with crypto libraries
- Complex authentication logic delegated to API routes

**Redirect Safety:**
- Uses `NextResponse.redirect()` with absolute URLs
- Prevents redirect loops with pathname checks
- Handles production vs development differences

**Security Trade-offs:**
- Provides basic token presence validation
- Real token validation occurs in API routes
- Client-side handles token refresh logic
- Middleware serves as first line of defense



Built with love for SohCahToa Holdings Assessment 
Tunde OKEYEMI
Thank you 
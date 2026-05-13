I found the admin panel is not reliably loading because the admin layout waits on client-side session restoration, and protected admin server functions require an `Authorization` header that current `useServerFn` calls are not attaching. That can leave pages stuck on loading/verification or fail silently.

Plan:

1. Add a reusable admin server-function caller
   - Create a small client-safe helper that reads the current Lovable Cloud auth session.
   - It will pass `Authorization: Bearer <access_token>` into every protected admin `useServerFn` call.
   - If there is no session, it will throw a clear unauthenticated error instead of spinning forever.

2. Update every admin data route to use the authenticated caller
   - Dashboard
   - Analytics
   - Orders list
   - Order detail and order updates
   - Abandoned carts
   - Customers
   - Configuration read/update

3. Make admin route protection deterministic
   - Replace the current auth-state race with a single session check plus subscription update.
   - Always set a completed state when access is denied, so the layout cannot remain on “Verificando acceso…” forever.
   - Keep admin role validation server-backed through the existing `has_role` check.

4. Add visible error states instead of permanent “Cargando…”
   - Admin pages will show an actionable error message when auth/data fetch fails.
   - Analytics will no longer hide failures behind a loading placeholder.

5. Validate end-to-end
   - Open `/admin` and `/admin/analytics` in the preview.
   - Confirm network requests are fired for server functions with auth headers.
   - Confirm the page either renders the admin data or redirects to login when unauthenticated, with no infinite loading state.

Technical details:
- This stays on the current TanStack Start stack.
- No database schema change is needed.
- The existing admin role table/function remains the authorization source.
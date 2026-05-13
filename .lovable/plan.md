I found the current crash: `/admin` renders `data.revenue.d1`, but the dashboard data can arrive without the expected nested shape, so the route throws before it can show an error state. I also found a second issue: protected server functions were added, but `src/start.ts` is still missing the global auth-attacher middleware, which can make server function auth unreliable.

Plan:

1. Fix the dashboard render crash
- Update `src/routes/admin.index.tsx` to normalize the dashboard payload before rendering.
- Default missing `revenue`, `counts`, `visits`, and `daily` fields to safe zero/empty values.
- Show a real admin error message if the request fails instead of allowing a React crash page.

2. Fix protected server-function auth wiring
- Update `src/start.ts` to import `attachSupabaseAuth` and add it to `functionMiddleware` while preserving the existing error middleware.
- This lets protected TanStack server functions receive the current user session consistently.

3. Simplify the admin function caller
- Remove the fragile manual `headers` injection from `src/lib/admin-client.ts` and call server functions through the standard TanStack auth middleware path.
- Keep the explicit “session expired” check so unauthenticated users get a clear message.

4. Validate the fix before claiming it works
- Open `/admin` in the preview.
- Confirm it no longer shows the `undefined is not an object (evaluating 's.revenue.d1')` crash.
- Check console/network signals after the change and report exactly what was verified.

5. If the preview is unauthenticated
- Confirm that `/admin` redirects to login or shows the no-access state rather than crashing.
- I will not claim the admin data itself loads unless I can verify it in an authenticated admin session.
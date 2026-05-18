I verified the hosted backend is healthy and the database currently contains real data:

- `page_views`: 531
- `analytics_events`: 145
- `carts`: 4
- `orders`: 0
- latest page view: 2026-05-18 01:40 UTC
- latest analytics event: 2026-05-18 01:16 UTC

So if the dashboard or analytics page is showing all zeroes, the break is in the admin data-fetch/render path, not in the database.

Plan:

1. Remove silent zero normalization from the admin dashboard
- Stop converting missing/failed response fields into `0` in `src/routes/admin.index.tsx`.
- Add a strict response validator so malformed or empty server responses show a visible error instead of fake zeroes.
- Keep the raw counts block, but make it impossible for it to display `0` unless the server actually returned `0`.

2. Add server-side diagnostics to admin data functions
- In `src/lib/admin.functions.ts`, check every database query result for `error`.
- If any query fails, throw a clear error naming the failed query instead of returning partial data.
- Add a small diagnostic payload to dashboard/analytics responses with raw total counts and timestamps, so the UI can prove what it received.

3. Fix analytics page the same way
- Add raw totals to `adminGetAnalytics`: total page views/events overall and within the selected date range.
- Update `src/routes/admin.analytics.tsx` to show those raw totals at the top.
- Remove fallback patterns that turn missing arrays/objects into empty zero-looking analytics without warning.

4. Make admin auth/data loading explicit
- Keep `/admin` role checking, but make failed auth and failed data fetch visually distinct.
- If the user has no admin role, show that explicitly.
- If the admin data function fails, show the server error and a retry button.

5. Validate the fix with evidence
- Query the database again after implementation.
- Use the preview/admin data path or server logs where possible to confirm the admin function is being called and no longer returns silent empty data.
- Do not claim it works unless the relevant signal confirms it.
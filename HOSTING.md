# Deploy to Supabase and Netlify

## 1. Create the Supabase project

Create a dedicated GM Agro ERP project in your Supabase organization. Choose the available region nearest your staff in India and save the database password securely. Record the Project URL and publishable key. Record the legacy service_role key as a server-only secret for Storage and account creation. Do not expose DATABASE_URL or SUPABASE_SERVICE_ROLE_KEY through NEXT_PUBLIC variables.

In Connect, copy the pooler PostgreSQL connection string suitable for your Netlify serverless environment. Prefer transaction mode; this application uses parameterized queries without named prepared statements. Preserve TLS. This build uses server-side PostgreSQL access, not a public browser Data API.

## 2. Apply the migration

Open Supabase SQL Editor and run `supabase/migrations/001_erp.sql`, or use the migrate script with DATABASE_URL loaded securely. The script creates six ERP tables, indexes, restrictive table access and a private 25 MB evidence bucket.

All ERP tables have RLS enabled and no direct anon/authenticated grants or policies. The protected Next.js routes implement record, role and territory checks. Keep the PostgreSQL server credential and service role key secret; they bypass browser RLS.

The migration must run before the first ERP request. Do not run migrations from each request or build.

## 3. Configure authentication

In Supabase Authentication, enable email/password and disable public account signups for the staff portal. Configure the Site URL to your current Netlify URL, later https://erp.gmagro.in. Register only the actual application URLs you use. This build uses password sign-in; it does not implement OAuth, magic links or invite-link completion.

Create the administrator's verified account. For a trusted provisioning process, use `scripts/create-user.mjs EMAIL` with INITIAL_PASSWORD supplied securely in the process environment and the server-only Supabase credentials. The script marks the administrator-provisioned email as confirmed: validate the employee's email identity before provisioning. Deliver temporary passwords privately, never in chat or source files. Users can change their password at /set-password after signing in.

Set ADMIN_EMAIL to that exact administrator email. Only this verified identity can bootstrap an empty ERP; an arbitrary first visitor cannot become Administrator. If importing an existing members table, its Administrator account remains authoritative and must have a matching Supabase Auth email. Adding a role in ERP does not automatically create a Supabase Auth account.

## 4. Deploy to Netlify

Put this source in a private Git repository and connect it as a new Netlify project. Use `npm run build`, publish `.next`, Node 22 and Netlify's current Next.js runtime. The netlify.toml supplies those settings plus the scheduled retry function. Do not use the old Vinext/Cloudflare build or a static-only upload.

Before deployment, set the following Netlify environment variables with the required Build/Functions scopes:

| Variable | Scope / purpose |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Build and Functions; project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Build and Functions; browser-safe key |
| DATABASE_URL | Functions only; Supabase pooler connection with TLS |
| SUPABASE_SERVICE_ROLE_KEY | Functions only; private evidence/account administration |
| ADMIN_EMAIL | Functions; trusted initial administrator |
| APP_URL | Functions; exact current production URL |
| RESEND_API_KEY | Functions; secret email sending key |
| RESEND_FROM | Functions; verified sender |
| MAINTENANCE_SECRET | Functions; random 32-byte service secret |

NEXT_PUBLIC values are included in browser bundles, so rebuild after changing them. Server variables are also applied with a fresh deployment. Restrict access to Netlify secrets. Never put secret values in netlify.toml or the repository.

The /api/maintenance endpoint accepts the dedicated bearer secret or a same-origin authenticated Administrator call. It does not trust the original Sites identity headers or the old PRIVATE_SITE_MAINTENANCE switch. Scheduled retries run every five minutes on production; manual notification processing remains available to Administrator.

## 5. Move existing data before cutover

If the original ERP contains live data, freeze writes for the final migration window and export all rows from members, records, audit, tracking and notifications. Make a JSON object with those five array properties. Do not confuse the embedded customer directory or demo data with live ERP records.

Run `node --env-file=.env.local scripts/import-d1.mjs snapshot.json`. It imports within a transaction and refuses a non-empty target to prevent accidental overwrite. It preserves IDs, versions and queued email IDs, and revokes old tracking sessions so officers consent again on the new host. Store the snapshot privately.

Copy all original R2 evidence into private `erp-evidence` using the original object keys. Confirm every evidence key referenced by complaint records exists, compare file counts and hashes, and test downloads under allowed and denied identities. Uploading this code package alone does not copy live database rows or R2 files. Keep Resend disabled until pending notifications are reviewed, to avoid unexpected historical sends.

## 6. Connect erp.gmagro.in

After the Netlify application passes sign-in and workflow checks, add erp.gmagro.in in Netlify Domain management. Add only the exact DNS record Netlify returns at the provider that manages gmagro.in. Wait for domain verification and HTTPS. Then update APP_URL and the Supabase Auth Site URL and deploy again.

Keep the main www.gmagro.in website on its current host. Add a normal ERP link to it. Use top-level navigation rather than embedding the portal in an iframe.

## 7. Activate Resend and verify

Verify the sending domain in Resend with the returned DNS records. Configure the sender and server key. Provider acceptance in the ERP is not confirmed delivery; inspect Resend delivery logs for the test message. This package does not add delivery/bounce webhooks.

In Netlify Functions, verify erp-maintenance is scheduled and use Run now to test it. Review its logs and the ERP notification register. The original Sites hourly maintenance task should be paused after successful cutover; it remains separate from Netlify. Do not run both old and new sites for live writes and notifications during cutover.

## 8. Acceptance checklist

- Test Administrator, Sales Officer, a two-territory Sales Manager, Regional Sales Manager, Accounts, CEO, MD, Production and Quality accounts.
- Complete one order through every stage, verify forbidden bypasses and stale versions are rejected.
- File a complaint with real photo and video, GPS and batch details; verify evidence access across permitted and denied zones; finish RCA/CAPA and customer-confirmed closure.
- Test a 25 MB upload directly to Storage and finalization, plus camera/browser compatibility on target phones.
- Start GPS only with officer consent and browser permission; verify routes, stop sharing and reject the revoked session. Website tracking requires an active browser; phone-lock background tracking requires a mobile app.
- Test logout, password change, expired-session refresh and unauthenticated access to data and sales review.
- Verify database row counts, evidence hashes and scheduled email delivery in the actual hosted projects before announcing migration complete.

Local validation covers PostgreSQL workflow behavior and mocked Supabase/Resend interactions. It cannot prove real project credentials, hosted DNS, device permission behavior or delivered email before deployment.

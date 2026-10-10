# GM Agro ERP — Supabase + Netlify

This is the migrated application source. The original Cloudflare-hosted ERP remains separate until a verified cutover. No production Supabase project or credentials are included, and this package does not claim that existing live records have already been copied.

## Included

- PostgreSQL orders, staff roles, audit trail, complaint investigation, consent/session-based GPS and notification queue.
- Supabase verified email/password sign-in and server session refresh; role assignments remain server-enforced.
- Private Supabase evidence bucket. Browser uploads use server-issued signed upload tokens; finalization checks ownership and size and creates a separate immutable evidence object with SHA-256, GPS and time. Downloads authorize territory access before issuing a 60-second signed link.
- The original 24 products and 658-customer directory. Customer data is returned only after staff authorization and is scoped by territory. Full sales review is restricted to all-zone management.
- Resend operational email queue with idempotency and retries; Netlify retries every five minutes once deployed and configured.
- SQL migration, safe D1 JSON importer, environment template and Netlify config.

## Local setup

Use Node.js 22.13 or later.

```sh
npm ci
cp .env.example .env.local
```

Fill .env.local from your Supabase project and secure server settings. Never commit it. Next.js loads it automatically for dev/build; scripts need the environment explicitly loaded:

```sh
node --env-file=.env.local scripts/migrate.mjs
npm run dev
```

Run checks with `npm test` and `npm run build`.

Read HOSTING.md for the complete hosted setup and cutover. This is a full-stack application: a static drag-and-drop upload is insufficient.

# PassTrack Landing Page

High-conversion early access landing page for **PassTrack** (`passtrack.sg`) built with Next.js + Tailwind CSS.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Mobile-first responsive UI

## Sections Included

- Hero
- Problem awareness
- Solution benefits
- Early access signup form
- Trust block
- Footer

## Lead Capture

Form submits to `POST /api/early-access`.

In production, leads are delivered to one or both persistent destinations:

- Webhook via `LEAD_WEBHOOK_URL`
- Admin email via `ADMIN_NOTIFICATION_EMAIL` + (`RESEND_API_KEY` or SMTP settings)

Lead submit returns success only when at least one destination succeeds.

Lead fields:

- `timestamp`
- `name`
- `workEmail`
- `company`
- `employeeCount`
- `source`
- `whatsapp` (optional)
- `primaryNeed`

## Admin Leads Dashboard

- Web dashboard: `/admin/leads`
- JSON endpoint: `/api/admin/leads`

Both routes are protected by Basic Auth using environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

In production, these credentials are required for admin routes.

## Production Storage

- Recommended: set `DATABASE_URL` (Neon/Postgres) for persistent lead storage on Vercel.
- Optional destinations: webhook (`LEAD_WEBHOOK_URL`) and/or admin email (`ADMIN_NOTIFICATION_EMAIL` + Resend/SMTP).
- Lead submit returns success when at least one destination succeeds.

See `.env.example` for required variables.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run start
```

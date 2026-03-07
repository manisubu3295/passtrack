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

Form submits to `POST /api/early-access` and stores leads in `data/leads.json`.

## Admin Leads Dashboard

- Web dashboard: `/admin/leads`
- JSON endpoint: `/api/admin/leads`

Both routes are protected by Basic Auth using environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

In production, these credentials are required for admin routes.

## Production Storage

- Set `DATABASE_URL` to use PostgreSQL (recommended for production).
- If `DATABASE_URL` is not set, app uses local file storage (`data/leads.json`) for development.

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

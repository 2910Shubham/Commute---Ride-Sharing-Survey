# Commute & Ride-Sharing Survey

Next.js survey form (English + Hinglish) with PostgreSQL storage.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL`.

3. Create the database table:

```bash
npm run db:init
```

4. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin dashboard

Open [http://localhost:3000/survey/admin](http://localhost:3000/survey/admin).

You will be redirected to the login page:

- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## Stack

- Next.js (App Router)
- React Hook Form + Zod
- shadcn/ui
- PostgreSQL (`pg`)

Responses are saved to the `survey_responses` table.

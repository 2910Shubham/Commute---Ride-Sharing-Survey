import { Pool, type QueryResultRow } from "pg"

const globalForDb = globalThis as unknown as {
  pgPool?: Pool
  schemaReady?: Promise<void>
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  if (!globalForDb.pgPool) {
    const connectionString = process.env.DATABASE_URL.includes("uselibpqcompat=")
      ? process.env.DATABASE_URL
      : `${process.env.DATABASE_URL}${process.env.DATABASE_URL.includes("?") ? "&" : "?"}uselibpqcompat=true`

    globalForDb.pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    })
  }

  return globalForDb.pgPool
}

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  name TEXT,
  age TEXT,
  survey_date TEXT,

  owns_vehicle TEXT NOT NULL,
  primary_commute TEXT NOT NULL,
  primary_commute_other TEXT,
  monthly_fuel_spend NUMERIC(12, 2) NOT NULL,
  weekly_km NUMERIC(12, 2) NOT NULL,
  ride_sharing_frequency TEXT NOT NULL,
  accept_ride_likelihood SMALLINT NOT NULL,
  offer_ride_willingness SMALLINT NOT NULL,
  biggest_concern TEXT NOT NULL,
  biggest_concern_other TEXT,
  monthly_savings TEXT NOT NULL,
  monthly_savings_other TEXT,
  use_trusted_app TEXT NOT NULL,

  optional_age TEXT,
  occupation TEXT,
  occupation_other TEXT,
  city TEXT
);
`

export async function ensureSchema() {
  if (!globalForDb.schemaReady) {
    globalForDb.schemaReady = (async () => {
      const pool = getPool()
      // gen_random_uuid() needs pgcrypto on older Postgres; try extension then fallback
      try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)
      } catch {
        // extension may not be allowed on managed hosts; uuid default may still exist
      }
      await pool.query(CREATE_TABLE_SQL)
    })().catch((error) => {
      globalForDb.schemaReady = undefined
      throw error
    })
  }

  await globalForDb.schemaReady
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  await ensureSchema()
  return getPool().query<T>(text, params)
}

import { query } from "@/lib/db"

export type CountRow = {
  key: string
  count: number
}

export type ResponseRow = {
  id: string
  created_at: Date
  respondent_no: number
  name: string | null
  age: string | null
  city: string | null
  occupation: string | null
  owns_vehicle: string
  primary_commute: string
  monthly_fuel_spend: string
  weekly_km: string
  ride_sharing_frequency: string
  accept_ride_likelihood: number
  offer_ride_willingness: number
  biggest_concern: string
  monthly_savings: string
  use_trusted_app: string
}

export type AnalyticsData = {
  totals: {
    responses: number
    avgFuelSpend: number
    avgWeeklyKm: number
    avgAcceptLikelihood: number
    avgOfferWillingness: number
    willingToUseAppPct: number
  }
  distributions: {
    ownsVehicle: CountRow[]
    primaryCommute: CountRow[]
    rideSharingFrequency: CountRow[]
    acceptRideLikelihood: CountRow[]
    offerRideWillingness: CountRow[]
    biggestConcern: CountRow[]
    monthlySavings: CountRow[]
    useTrustedApp: CountRow[]
    occupation: CountRow[]
    city: CountRow[]
  }
  recent: ResponseRow[]
}

async function groupBy(column: string): Promise<CountRow[]> {
  const result = await query<{ key: string; count: string }>(
    `
    SELECT COALESCE(${column}::text, 'unknown') AS key, COUNT(*)::int AS count
    FROM survey_responses
    GROUP BY 1
    ORDER BY count DESC, key ASC
    `
  )

  return result.rows.map((row) => ({
    key: row.key,
    count: Number(row.count),
  }))
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const summary = await query<{
    responses: string
    avg_fuel: string | null
    avg_km: string | null
    avg_accept: string | null
    avg_offer: string | null
    willing_pct: string | null
  }>(
    `
    SELECT
      COUNT(*)::int AS responses,
      AVG(monthly_fuel_spend)::float AS avg_fuel,
      AVG(weekly_km)::float AS avg_km,
      AVG(accept_ride_likelihood)::float AS avg_accept,
      AVG(offer_ride_willingness)::float AS avg_offer,
      (
        AVG(
          CASE
            WHEN use_trusted_app IN ('definitely_yes', 'probably_yes') THEN 1.0
            ELSE 0.0
          END
        ) * 100
      )::float AS willing_pct
    FROM survey_responses
    `
  )

  const row = summary.rows[0]
  const recentResult = await query<Omit<ResponseRow, "respondent_no"> & { respondent_no: string }>(
    `
    WITH numbered AS (
      SELECT
        id,
        created_at,
        name,
        age,
        city,
        occupation,
        owns_vehicle,
        primary_commute,
        monthly_fuel_spend::text,
        weekly_km::text,
        ride_sharing_frequency,
        accept_ride_likelihood,
        offer_ride_willingness,
        biggest_concern,
        monthly_savings,
        use_trusted_app,
        ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC)::int AS respondent_no
      FROM survey_responses
    )
    SELECT *
    FROM numbered
    ORDER BY created_at DESC
    LIMIT 50
    `
  )

  const recent: ResponseRow[] = recentResult.rows.map((row) => ({
    ...row,
    respondent_no: Number(row.respondent_no),
  }))

  const [
    ownsVehicle,
    primaryCommute,
    rideSharingFrequency,
    acceptRideLikelihood,
    offerRideWillingness,
    biggestConcern,
    monthlySavings,
    useTrustedApp,
    occupation,
    city,
  ] = await Promise.all([
    groupBy("owns_vehicle"),
    groupBy("primary_commute"),
    groupBy("ride_sharing_frequency"),
    groupBy("accept_ride_likelihood"),
    groupBy("offer_ride_willingness"),
    groupBy("biggest_concern"),
    groupBy("monthly_savings"),
    groupBy("use_trusted_app"),
    groupBy("occupation"),
    groupBy("city"),
  ])

  return {
    totals: {
      responses: Number(row?.responses ?? 0),
      avgFuelSpend: Number(row?.avg_fuel ?? 0),
      avgWeeklyKm: Number(row?.avg_km ?? 0),
      avgAcceptLikelihood: Number(row?.avg_accept ?? 0),
      avgOfferWillingness: Number(row?.avg_offer ?? 0),
      willingToUseAppPct: Number(row?.willing_pct ?? 0),
    },
    distributions: {
      ownsVehicle,
      primaryCommute,
      rideSharingFrequency,
      acceptRideLikelihood,
      offerRideWillingness,
      biggestConcern,
      monthlySavings,
      useTrustedApp,
      occupation,
      city,
    },
    recent,
  }
}

import { query } from "@/lib/db"
import { labelFor, labelMaps } from "@/lib/label-maps"

export type FullResponse = {
  id: string
  created_at: Date
  respondent_no: number
  name: string | null
  age: string | null
  survey_date: string | null
  owns_vehicle: string
  primary_commute: string
  primary_commute_other: string | null
  monthly_fuel_spend: string
  weekly_km: string
  ride_sharing_frequency: string
  accept_ride_likelihood: number
  offer_ride_willingness: number
  biggest_concern: string
  biggest_concern_other: string | null
  monthly_savings: string
  monthly_savings_other: string | null
  use_trusted_app: string
  optional_age: string | null
  occupation: string | null
  occupation_other: string | null
  city: string | null
}

const FULL_SELECT = `
  id,
  created_at,
  name,
  age,
  survey_date,
  owns_vehicle,
  primary_commute,
  primary_commute_other,
  monthly_fuel_spend::text,
  weekly_km::text,
  ride_sharing_frequency,
  accept_ride_likelihood,
  offer_ride_willingness,
  biggest_concern,
  biggest_concern_other,
  monthly_savings,
  monthly_savings_other,
  use_trusted_app,
  optional_age,
  occupation,
  occupation_other,
  city
`

export async function listRespondents(): Promise<FullResponse[]> {
  const result = await query<Omit<FullResponse, "respondent_no"> & { respondent_no: string }>(
    `
    SELECT
      ${FULL_SELECT},
      ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC)::int AS respondent_no
    FROM survey_responses
    ORDER BY created_at ASC, id ASC
    `
  )

  return result.rows.map((row) => ({
    ...row,
    respondent_no: Number(row.respondent_no),
  }))
}

export async function getRespondentCount() {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM survey_responses`
  )
  return Number(result.rows[0]?.count ?? 0)
}

export async function getRespondentByNumber(
  respondentNo: number
): Promise<FullResponse | null> {
  if (!Number.isInteger(respondentNo) || respondentNo < 1) return null

  const result = await query<Omit<FullResponse, "respondent_no"> & { respondent_no: string }>(
    `
    WITH numbered AS (
      SELECT
        ${FULL_SELECT},
        ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC)::int AS respondent_no
      FROM survey_responses
    )
    SELECT *
    FROM numbered
    WHERE respondent_no = $1
    `,
    [respondentNo]
  )

  const row = result.rows[0]
  if (!row) return null

  return {
    ...row,
    respondent_no: Number(row.respondent_no),
  }
}

function display(value: string | number | null | undefined) {
  if (value == null || value === "") return ""
  return String(value)
}

export function respondentToAnswerRows(response: FullResponse) {
  return [
    { question: "Respondent #", answer: String(response.respondent_no) },
    {
      question: "Submitted at",
      answer: new Date(response.created_at).toLocaleString("en-IN"),
    },
    { question: "Name (optional)", answer: display(response.name) || "—" },
    { question: "Age (header)", answer: display(response.age) || "—" },
    { question: "Date (header)", answer: display(response.survey_date) || "—" },
    {
      question: "Q1. Do you own a vehicle?",
      answer: labelFor(labelMaps.ownsVehicle, response.owns_vehicle),
    },
    {
      question: "Q2. Primary mode of daily commute",
      answer: labelFor(labelMaps.primaryCommute, response.primary_commute),
    },
    {
      question: "Q2. Other (text)",
      answer: display(response.primary_commute_other) || "—",
    },
    {
      question: "Q3. Monthly fuel spend (Rs.)",
      answer: display(response.monthly_fuel_spend),
    },
    {
      question: "Q4. Weekly kilometers",
      answer: display(response.weekly_km),
    },
    {
      question: "Q5. Ride sharing / pooling frequency",
      answer: labelFor(
        labelMaps.rideSharingFrequency,
        response.ride_sharing_frequency
      ),
    },
    {
      question: "Q6. Likelihood of accepting a ride",
      answer: labelFor(
        labelMaps.acceptRideLikelihood,
        response.accept_ride_likelihood
      ),
    },
    {
      question: "Q7. Willingness to offer a ride",
      answer: labelFor(
        labelMaps.offerRideWillingness,
        response.offer_ride_willingness
      ),
    },
    {
      question: "Q8. Biggest concern about ride pooling",
      answer: labelFor(labelMaps.biggestConcern, response.biggest_concern),
    },
    {
      question: "Q8. Other (text)",
      answer: display(response.biggest_concern_other) || "—",
    },
    {
      question: "Q9. Approx. monthly savings if fuel cut 50%",
      answer: labelFor(labelMaps.monthlySavings, response.monthly_savings),
    },
    {
      question: "Q9. Other savings amount (text)",
      answer: display(response.monthly_savings_other) || "—",
    },
    {
      question: "Q10. Would use a trusted ride pooling app",
      answer: labelFor(labelMaps.useTrustedApp, response.use_trusted_app),
    },
    {
      question: "Optional — Age",
      answer: display(response.optional_age) || "—",
    },
    {
      question: "Optional — Occupation",
      answer: labelFor(labelMaps.occupation, response.occupation),
    },
    {
      question: "Optional — Occupation other (text)",
      answer: display(response.occupation_other) || "—",
    },
    {
      question: "Optional — City",
      answer: display(response.city) || "—",
    },
  ]
}

export function responsesToCsv(rows: FullResponse[]) {
  const headers = [
    "respondent_no",
    "id",
    "created_at",
    "name",
    "age",
    "survey_date",
    "owns_vehicle",
    "owns_vehicle_label",
    "primary_commute",
    "primary_commute_label",
    "primary_commute_other",
    "monthly_fuel_spend",
    "weekly_km",
    "ride_sharing_frequency",
    "ride_sharing_frequency_label",
    "accept_ride_likelihood",
    "accept_ride_likelihood_label",
    "offer_ride_willingness",
    "offer_ride_willingness_label",
    "biggest_concern",
    "biggest_concern_label",
    "biggest_concern_other",
    "monthly_savings",
    "monthly_savings_label",
    "monthly_savings_other",
    "use_trusted_app",
    "use_trusted_app_label",
    "optional_age",
    "occupation",
    "occupation_label",
    "occupation_other",
    "city",
  ]

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.respondent_no,
        row.id,
        new Date(row.created_at).toISOString(),
        row.name,
        row.age,
        row.survey_date,
        row.owns_vehicle,
        labelFor(labelMaps.ownsVehicle, row.owns_vehicle),
        row.primary_commute,
        labelFor(labelMaps.primaryCommute, row.primary_commute),
        row.primary_commute_other,
        row.monthly_fuel_spend,
        row.weekly_km,
        row.ride_sharing_frequency,
        labelFor(labelMaps.rideSharingFrequency, row.ride_sharing_frequency),
        row.accept_ride_likelihood,
        labelFor(labelMaps.acceptRideLikelihood, row.accept_ride_likelihood),
        row.offer_ride_willingness,
        labelFor(labelMaps.offerRideWillingness, row.offer_ride_willingness),
        row.biggest_concern,
        labelFor(labelMaps.biggestConcern, row.biggest_concern),
        row.biggest_concern_other,
        row.monthly_savings,
        labelFor(labelMaps.monthlySavings, row.monthly_savings),
        row.monthly_savings_other,
        row.use_trusted_app,
        labelFor(labelMaps.useTrustedApp, row.use_trusted_app),
        row.optional_age,
        row.occupation,
        labelFor(labelMaps.occupation, row.occupation),
        row.occupation_other,
        row.city,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ]

  return `\uFEFF${lines.join("\n")}`
}

function csvEscape(value: string | number | null | undefined) {
  if (value == null) return ""
  const text = String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

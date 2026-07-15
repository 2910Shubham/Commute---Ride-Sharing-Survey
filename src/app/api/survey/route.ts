import { NextResponse } from "next/server"

import { query } from "@/lib/db"
import { surveySchema } from "@/lib/survey-schema"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = surveySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    const result = await query<{ id: string }>(
      `
      INSERT INTO survey_responses (
        name,
        age,
        survey_date,
        owns_vehicle,
        primary_commute,
        primary_commute_other,
        monthly_fuel_spend,
        weekly_km,
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
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      )
      RETURNING id
      `,
      [
        emptyToNull(data.name),
        emptyToNull(data.age),
        emptyToNull(data.date),
        data.ownsVehicle,
        data.primaryCommute,
        emptyToNull(data.primaryCommuteOther),
        Number(data.monthlyFuelSpend),
        Number(data.weeklyKm),
        data.rideSharingFrequency,
        Number(data.acceptRideLikelihood),
        Number(data.offerRideWillingness),
        data.biggestConcern,
        emptyToNull(data.biggestConcernOther),
        data.monthlySavings,
        emptyToNull(data.monthlySavingsOther),
        data.useTrustedApp,
        emptyToNull(data.optionalAge),
        emptyToNull(data.occupation),
        emptyToNull(data.occupationOther),
        emptyToNull(data.city),
      ]
    )

    return NextResponse.json({
      success: true,
      id: result.rows[0]?.id,
    })
  } catch (error) {
    console.error("Survey submit error:", error)
    return NextResponse.json(
      { error: "Failed to save survey response" },
      { status: 500 }
    )
  }
}

function emptyToNull(value?: string | null) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === "" ? null : trimmed
}

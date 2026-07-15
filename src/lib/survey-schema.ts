import { z } from "zod"

export const surveySchema = z.object({
  name: z.string().optional(),
  age: z.string().optional(),
  date: z.string().optional(),

  ownsVehicle: z.enum(["two_wheeler", "car", "both", "no"], {
    message: "Please select an option",
  }),

  primaryCommute: z.enum(
    [
      "personal_bike",
      "personal_car",
      "public_transport",
      "cab",
      "auto",
      "walking_cycling",
      "other",
    ],
    { message: "Please select an option" }
  ),
  primaryCommuteOther: z.string().optional(),

  monthlyFuelSpend: z
    .string()
    .min(1, "Please enter monthly fuel spend")
    .regex(/^\d+(\.\d+)?$/, "Enter a valid number"),

  weeklyKm: z
    .string()
    .min(1, "Please enter weekly kilometers")
    .regex(/^\d+(\.\d+)?$/, "Enter a valid number"),

  rideSharingFrequency: z.enum(["regularly", "occasionally", "rarely", "never"], {
    message: "Please select an option",
  }),

  acceptRideLikelihood: z.enum(["1", "2", "3", "4", "5"], {
    message: "Please select an option",
  }),

  offerRideWillingness: z.enum(["1", "2", "3", "4", "5"], {
    message: "Please select an option",
  }),

  biggestConcern: z.enum(
    ["safety", "privacy", "time_delays", "trusting_strangers", "no_concerns", "other"],
    { message: "Please select an option" }
  ),
  biggestConcernOther: z.string().optional(),

  monthlySavings: z.enum(
    ["lt_500", "500_1000", "1000_2000", "2000_5000", "gt_5000", "not_sure", "other"],
    { message: "Please select an option" }
  ),
  monthlySavingsOther: z.string().optional(),

  useTrustedApp: z.enum(
    ["definitely_yes", "probably_yes", "maybe", "probably_no", "definitely_no"],
    { message: "Please select an option" }
  ),

  // Optional demographics (footer section)
  optionalAge: z.string().optional(),
  occupation: z.enum(["student", "working", "business", "other"]).optional(),
  occupationOther: z.string().optional(),
  city: z.string().optional(),
})

export type SurveyFormValues = z.infer<typeof surveySchema>

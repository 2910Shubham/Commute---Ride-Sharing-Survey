import {
  acceptRideOptions,
  concernOptions,
  occupationOptions,
  offerRideOptions,
  ownsVehicleOptions,
  primaryCommuteOptions,
  rideSharingOptions,
  savingsOptions,
  trustedAppOptions,
  type Option,
} from "@/lib/survey-options"

function toMap(options: Option[]) {
  return Object.fromEntries(options.map((o) => [o.value, o.label])) as Record<
    string,
    string
  >
}

export const labelMaps = {
  ownsVehicle: toMap(ownsVehicleOptions),
  primaryCommute: toMap(primaryCommuteOptions),
  rideSharingFrequency: toMap(rideSharingOptions),
  acceptRideLikelihood: toMap(acceptRideOptions),
  offerRideWillingness: toMap(offerRideOptions),
  biggestConcern: toMap(concernOptions),
  monthlySavings: toMap(savingsOptions),
  useTrustedApp: toMap(trustedAppOptions),
  occupation: toMap(occupationOptions),
}

export function labelFor(
  map: Record<string, string>,
  value: string | number | null | undefined
) {
  if (value == null || value === "") return "—"
  const key = String(value)
  return map[key] ?? key
}

export type Option = {
  value: string
  label: string
  hinglish: string
}

export const ownsVehicleOptions: Option[] = [
  { value: "two_wheeler", label: "Yes, Two-wheeler", hinglish: "Haan, Two-wheeler" },
  { value: "car", label: "Yes, Car", hinglish: "Haan, Car" },
  { value: "both", label: "Yes, Both", hinglish: "Haan, Dono" },
  { value: "no", label: "No", hinglish: "Nahi" },
]

export const primaryCommuteOptions: Option[] = [
  { value: "personal_bike", label: "Personal bike/scooter", hinglish: "Apni bike/scooter" },
  { value: "personal_car", label: "Personal car", hinglish: "Apni car" },
  { value: "public_transport", label: "Public transport", hinglish: "Public transport" },
  { value: "cab", label: "Cab (Uber/Ola)", hinglish: "Cab (Uber/Ola)" },
  { value: "auto", label: "Auto/Rickshaw", hinglish: "Auto/Rickshaw" },
  { value: "walking_cycling", label: "Walking/Cycling", hinglish: "Paidal/Cycle" },
  { value: "other", label: "Other / Anya", hinglish: "" },
]

export const rideSharingOptions: Option[] = [
  { value: "regularly", label: "Regularly", hinglish: "Niyamit roop se" },
  { value: "occasionally", label: "Occasionally", hinglish: "Kabhi kabhi" },
  { value: "rarely", label: "Rarely", hinglish: "Kam hi" },
  { value: "never", label: "Never", hinglish: "Kabhi nahi" },
]

export const acceptRideOptions: Option[] = [
  { value: "1", label: "1 — Definitely not", hinglish: "1 — Bilkul nahi" },
  { value: "2", label: "2 — Unlikely", hinglish: "2 — Shayad nahi" },
  { value: "3", label: "3 — Maybe", hinglish: "3 — Shayad" },
  { value: "4", label: "4 — Likely", hinglish: "4 — Shayad haan" },
  { value: "5", label: "5 — Definitely", hinglish: "5 — Bilkul" },
]

export const offerRideOptions: Option[] = [
  { value: "1", label: "1 — Not willing", hinglish: "1 — Willing nahi" },
  { value: "2", label: "2", hinglish: "" },
  { value: "3", label: "3", hinglish: "" },
  { value: "4", label: "4", hinglish: "" },
  { value: "5", label: "5 — Very willing", hinglish: "5 — Bahut willing" },
]

export const concernOptions: Option[] = [
  { value: "safety", label: "Safety", hinglish: "Safety" },
  { value: "privacy", label: "Privacy", hinglish: "Privacy" },
  { value: "time_delays", label: "Time delays", hinglish: "Time delay" },
  {
    value: "trusting_strangers",
    label: "Trusting strangers",
    hinglish: "Anjaan logo par trust karna",
  },
  { value: "no_concerns", label: "No concerns", hinglish: "Koi chinta nahi" },
  { value: "other", label: "Other / Anya", hinglish: "" },
]

export const savingsOptions: Option[] = [
  { value: "lt_500", label: "Less than Rs. 500", hinglish: "Rs. 500 se kam" },
  { value: "500_1000", label: "Rs. 500 — Rs. 1000", hinglish: "Rs. 500 — Rs. 1000" },
  { value: "1000_2000", label: "Rs. 1000 — Rs. 2000", hinglish: "Rs. 1000 — Rs. 2000" },
  { value: "2000_5000", label: "Rs. 2000 — Rs. 5000", hinglish: "Rs. 2000 — Rs. 5000" },
  { value: "gt_5000", label: "More than Rs. 5000", hinglish: "Rs. 5000 se zyada" },
  { value: "not_sure", label: "Not sure", hinglish: "Pata nahi" },
  { value: "other", label: "Other / Anya", hinglish: "" },
]

export const trustedAppOptions: Option[] = [
  { value: "definitely_yes", label: "Definitely Yes", hinglish: "Bilkul Haan" },
  { value: "probably_yes", label: "Probably Yes", hinglish: "Shayad Haan" },
  { value: "maybe", label: "Maybe", hinglish: "Shayad" },
  { value: "probably_no", label: "Probably No", hinglish: "Shayad Nahi" },
  { value: "definitely_no", label: "Definitely No", hinglish: "Bilkul Nahi" },
]

export const occupationOptions: Option[] = [
  { value: "student", label: "Student", hinglish: "Student" },
  { value: "working", label: "Working Professional", hinglish: "Working Professional" },
  { value: "business", label: "Business", hinglish: "Business" },
  { value: "other", label: "Other (Anya)", hinglish: "" },
]

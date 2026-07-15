"use client"

import { forwardRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  acceptRideOptions,
  concernOptions,
  offerRideOptions,
  occupationOptions,
  ownsVehicleOptions,
  primaryCommuteOptions,
  rideSharingOptions,
  savingsOptions,
  trustedAppOptions,
  type Option,
} from "@/lib/survey-options"
import { surveySchema, type SurveyFormValues } from "@/lib/survey-schema"

function QuestionTitle({
  number,
  english,
  hinglish,
}: {
  number: number
  english: string
  hinglish: string
}) {
  return (
    <div className="mb-2 space-y-0.5">
      <p className="text-[13px] leading-snug font-semibold text-neutral-900">
        {number}. {english}
      </p>
      <p className="text-[12px] leading-snug text-neutral-500 italic">{hinglish}</p>
    </div>
  )
}

function OptionLabel({ option }: { option: Option }) {
  return (
    <span className="text-[13px] leading-snug text-neutral-800">
      {option.label}
      {option.hinglish ? (
        <span className="ml-1 text-[12px] text-neutral-500 italic">
          ({option.hinglish})
        </span>
      ) : null}
    </span>
  )
}

const RadioOptions = forwardRef<
  HTMLDivElement,
  {
    options: Option[]
    value: string | undefined
    onChange: (value: string) => void
    name: string
  }
>(function RadioOptions({ options, value, onChange, name }, ref) {
  return (
    <RadioGroup
      ref={ref}
      name={name}
      value={value ?? ""}
      onValueChange={onChange}
      className="gap-1.5"
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-2 py-0.5"
        >
          <RadioGroupItem value={option.value} className="mt-0.5 rounded-sm" />
          <OptionLabel option={option} />
        </label>
      ))}
    </RadioGroup>
  )
})

const underlineInput =
  "h-7 rounded-none border-0 border-b border-neutral-400 bg-transparent px-1 shadow-none focus-visible:border-neutral-800 focus-visible:ring-0"

export function SurveyForm() {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      name: "",
      age: "",
      date: new Date().toISOString().slice(0, 10),
      ownsVehicle: undefined,
      primaryCommute: undefined,
      primaryCommuteOther: "",
      monthlyFuelSpend: "",
      weeklyKm: "",
      rideSharingFrequency: undefined,
      acceptRideLikelihood: undefined,
      offerRideWillingness: undefined,
      biggestConcern: undefined,
      biggestConcernOther: "",
      monthlySavings: undefined,
      monthlySavingsOther: "",
      useTrustedApp: undefined,
      optionalAge: "",
      occupation: undefined,
      occupationOther: "",
      city: "",
    },
  })

  const primaryCommute = form.watch("primaryCommute")
  const biggestConcern = form.watch("biggestConcern")
  const monthlySavings = form.watch("monthlySavings")
  const occupation = form.watch("occupation")

  async function onSubmit(values: SurveyFormValues) {
    setSubmitError(null)

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const payload = (await response.json()) as {
        success?: boolean
        id?: string
        error?: string
      }

      if (!response.ok) {
        throw new Error(payload.error || "Failed to submit survey")
      }

      setSubmittedId(payload.id ?? "ok")
      form.reset({
        ...form.getValues(),
        name: "",
        age: "",
        date: new Date().toISOString().slice(0, 10),
        ownsVehicle: undefined,
        primaryCommute: undefined,
        primaryCommuteOther: "",
        monthlyFuelSpend: "",
        weeklyKm: "",
        rideSharingFrequency: undefined,
        acceptRideLikelihood: undefined,
        offerRideWillingness: undefined,
        biggestConcern: undefined,
        biggestConcernOther: "",
        monthlySavings: undefined,
        monthlySavingsOther: "",
        useTrustedApp: undefined,
        optionalAge: "",
        occupation: undefined,
        occupationOther: "",
        city: "",
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong"
      )
    }
  }

  if (submittedId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">
          Thank you / Dhanyavaad
        </h1>
        <p className="mt-2 text-sm text-neutral-600 italic">
          Your response has been saved. / Aapka jawab save ho gaya hai.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmittedId(null)}
        >
          Submit another response
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-5xl bg-white px-4 py-6 sm:px-8 sm:py-8"
      >
        <header className="border-b border-neutral-800 pb-3 text-center">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Commute & Ride-Sharing Survey
          </h1>
          <p className="mt-0.5 text-sm text-neutral-600 italic">
            Commute aur Ride-Sharing Survey
          </p>
          <p className="mt-2 text-xs text-neutral-500 italic">
            Please tick the option(s) that best apply to you. / Jo option apply
            ho, use tick karein.
          </p>
        </header>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-b border-neutral-300 pb-4 text-[13px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-[180px] flex-1">
                <FormLabel className="text-[12px] font-normal text-neutral-700">
                  Name (optional) / Naam
                </FormLabel>
                <FormControl>
                  <Input className={underlineInput} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="w-28">
                <FormLabel className="text-[12px] font-normal text-neutral-700">
                  Age / Umar
                </FormLabel>
                <FormControl>
                  <Input className={underlineInput} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-40">
                <FormLabel className="text-[12px] font-normal text-neutral-700">
                  Date / Tareekh
                </FormLabel>
                <FormControl>
                  <Input type="date" className={underlineInput} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-2 grid gap-8 md:grid-cols-2 md:gap-0">
          <section className="space-y-5 md:border-r md:border-neutral-800 md:pr-6">
            <FormField
              control={form.control}
              name="ownsVehicle"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={1}
                    english="Do you own a vehicle?"
                    hinglish="Kya aapke paas vehicle hai?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={ownsVehicleOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="primaryCommute"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={2}
                    english="What is your primary mode of daily commute?"
                    hinglish="Aapka daily commute ka primary mode kya hai?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={primaryCommuteOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {primaryCommute === "other" ? (
                    <FormField
                      control={form.control}
                      name="primaryCommuteOther"
                      render={({ field: otherField }) => (
                        <FormItem className="mt-1 pl-6">
                          <FormControl>
                            <Input
                              placeholder="Please specify"
                              className={underlineInput}
                              {...otherField}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyFuelSpend"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={3}
                    english="Approximately how much do you spend on fuel every month?"
                    hinglish="Aap har mahine fuel par lagbhag kitna kharch karte hain?"
                  />
                  <FormDescription className="text-[11px] italic">
                    Numeric Answer / Numeric Jawab
                  </FormDescription>
                  <div className="mt-2 flex items-center gap-2 text-[13px]">
                    <span>Rs.</span>
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        className={`${underlineInput} max-w-[200px]`}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weeklyKm"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={4}
                    english="Approximately how many kilometers do you travel in a typical week?"
                    hinglish="Aap ek typical hafte mein lagbhag kitne kilometer travel karte hain?"
                  />
                  <FormDescription className="text-[11px] italic">
                    Numeric Answer / Numeric Jawab
                  </FormDescription>
                  <div className="mt-2 flex items-center gap-2 text-[13px]">
                    <FormControl>
                      <Input
                        inputMode="decimal"
                        className={`${underlineInput} max-w-[160px]`}
                        {...field}
                      />
                    </FormControl>
                    <span>km/week (km/hafta)</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rideSharingFrequency"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={5}
                    english="Do you currently share rides or use ride pooling?"
                    hinglish="Kya aap abhi ride share karte hain ya ride pooling use karte hain?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={rideSharingOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acceptRideLikelihood"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={6}
                    english="If someone traveling on the same route offered you a ride at a minimal cost, how likely are you to accept?"
                    hinglish="Agar same route par travel karne wala koi insaan aapko minimal cost par ride offer kare, to aap kitna accept karenge?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={acceptRideOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-5 md:pl-6">
            <FormField
              control={form.control}
              name="offerRideWillingness"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={7}
                    english="How willing are you to offer a ride to someone traveling on the same route?"
                    hinglish="Same route par travel karne wale kisi insaan ko ride offer karne ke liye aap kitne willing hain?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={offerRideOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biggestConcern"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={8}
                    english="What is your biggest concern about ride pooling?"
                    hinglish="Ride pooling ko lekar aapki sabse badi chinta kya hai?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={concernOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {biggestConcern === "other" ? (
                    <FormField
                      control={form.control}
                      name="biggestConcernOther"
                      render={({ field: otherField }) => (
                        <FormItem className="mt-1 pl-6">
                          <FormControl>
                            <Input
                              placeholder="Please specify"
                              className={underlineInput}
                              {...otherField}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlySavings"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={9}
                    english="If ride pooling could reduce your monthly fuel expense by 50%, approximately how much money would you save every month?"
                    hinglish="Agar ride pooling se aapka monthly fuel expense 50% kam ho jaye, to aap har mahine lagbhag kitna paisa bachayenge?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={savingsOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {monthlySavings === "other" ? (
                    <FormField
                      control={form.control}
                      name="monthlySavingsOther"
                      render={({ field: otherField }) => (
                        <FormItem className="mt-1 pl-6">
                          <div className="flex items-center gap-2 text-[13px]">
                            <span>Rs.</span>
                            <FormControl>
                              <Input
                                className={`${underlineInput} max-w-[160px]`}
                                {...otherField}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useTrustedApp"
              render={({ field }) => (
                <FormItem>
                  <QuestionTitle
                    number={10}
                    english="Would you use a trusted ride pooling app if it matched you with people traveling on the same route?"
                    hinglish="Agar ek trusted ride pooling app aapko same route par travel karne wale logo se match kare, to kya aap use karenge?"
                  />
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={trustedAppOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>

        <section className="mt-6 border-t border-neutral-800 pt-4">
          <p className="mb-3 text-[13px] font-semibold text-neutral-900">
            Optional (for better analysis){" "}
            <span className="font-normal text-neutral-500 italic">
              / Optional (behtar analysis ke liye)
            </span>
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="optionalAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-normal">
                    Age / Umar
                  </FormLabel>
                  <FormControl>
                    <Input className={underlineInput} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-normal">
                    City / Shahar
                  </FormLabel>
                  <FormControl>
                    <Input className={underlineInput} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[12px] font-normal">
                    Occupation / Peshaa
                  </FormLabel>
                  <FormControl>
                    <RadioOptions
                      name={field.name}
                      options={occupationOptions}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  {occupation === "other" ? (
                    <FormField
                      control={form.control}
                      name="occupationOther"
                      render={({ field: otherField }) => (
                        <FormItem className="mt-1">
                          <FormControl>
                            <Input
                              placeholder="Please specify"
                              className={underlineInput}
                              {...otherField}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : null}
                </FormItem>
              )}
            />
          </div>
        </section>

        {submitError ? (
          <p className="mt-4 text-sm text-red-600">{submitError}</p>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-neutral-300 pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="min-w-[140px]"
          >
            {form.formState.isSubmitting ? "Saving..." : "Submit / Bhejein"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

import { SurveyForm } from "@/components/survey-form"

export default function Home() {
  return (
    <main className="min-h-full bg-neutral-100">
      <div className="mx-auto max-w-5xl py-4 sm:py-8">
        <div className="border border-neutral-300 bg-white shadow-sm">
          <SurveyForm />
        </div>
      </div>
    </main>
  )
}

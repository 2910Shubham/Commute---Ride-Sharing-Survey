import { ensureSchema } from "../src/lib/db"

async function main() {
  await ensureSchema()
  console.log("survey_responses table is ready")
  process.exit(0)
}

main().catch((error) => {
  console.error("Failed to initialize database:", error)
  process.exit(1)
})

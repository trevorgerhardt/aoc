import { $ } from "bun"
import { getInput } from "./utils"

const TODAY = new Date().getDate()
console.log(`Creating new day: ${TODAY}`)
await $`cp days/template.ts days/${TODAY}.ts`
console.log(`Fetching input for day: ${TODAY}`)
await getInput(TODAY)
console.log("Done!")

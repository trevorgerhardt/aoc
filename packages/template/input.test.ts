import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 

`

function parse(input: string) {
	return input.trim().split("\n")
}

function calc(input: string) {
	const values = parse(input)
	return values.length
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(1)
})

test(`2024-${DAY}: Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nResult 👇\n", calc(input))
})

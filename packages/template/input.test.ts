import { describe, expect, test } from "bun:test"
import { getInput } from "../utils"

const DAY = 3

const exampleInput = ` 

`

function parseInput(input: string) {
	return input.trim().split("\n")
}

function calculateValue(input: string) {
	const values = parseInput(input)
	return values.length
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(0)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(0)
	})
})

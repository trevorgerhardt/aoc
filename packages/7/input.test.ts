import { describe, expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`

function parseInput(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => {
			const [t, ...r] = (line.match(/\d+/g) ?? []).map(Number)
			return { t, r }
		})
}

function findCalibration(c: number, t: number, r: number[]): boolean {
	if (r.length === 0) {
		return c === t
	}
	const v = r[0]
	return (
		findCalibration(c, t + v, r.slice(1)) ||
		findCalibration(c, t * v, r.slice(1)) ||
		findCalibration(c, Number(`${t}${v}`), r.slice(1))
	)
}

function calculateValue(input: string) {
	const values = parseInput(input)
	let total = 0
	for (const { t, r } of values) {
		if (findCalibration(t, 0, r)) {
			total += t
		}
	}
	return total
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(11387)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(1026766857276279)
	})
})

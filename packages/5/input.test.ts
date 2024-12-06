import { describe, expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`

function parseInput(input: string) {
	const [a, b] = input.trim().split("\n\n")
	const ordering: Record<number, Set<number>> = {}

	for (const line of a.split("\n")) {
		const [a, b] = line.split("|").map(Number)
		ordering[a] = ordering[a] ?? new Set()
		ordering[a].add(b)
	}

	return {
		ordering,
		prints: b.split("\n").map((line) => line.split(",").map(Number)),
	}
}

function printIsValid(print: number[], ordering: Record<number, Set<number>>) {
	for (let i = 0; i < print.length; i++) {
		const p1 = print[i]
		for (let j = 0; j < i; j++) {
			if (i === j) continue
			const p2 = print[j]
			if (i < j) {
				if (ordering[p2]?.has(p1)) return false
			} else {
				if (ordering[p1]?.has(p2)) return false
			}
		}
	}
	return true
}

function reorderPrint(print: number[], ordering: Record<number, Set<number>>) {
	return print.toSorted((a, b) => {
		if (ordering[a]?.has(b)) return -1
		if (ordering[b]?.has(a)) return 1
		return 0
	})
}

function calculateValue(input: string) {
	const values = parseInput(input)
	const invalidPrints = values.prints.filter(
		(print) => !printIsValid(print, values.ordering),
	)

	return invalidPrints
		.map((print) => reorderPrint(print, values.ordering))
		.reduce((acc, print) => acc + print[Math.floor(print.length / 2)], 0)
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(143)
	})

	test("input", async () => {
		expect(calculateValue(await getInput(DAY))).toBe(6142)
	})
})

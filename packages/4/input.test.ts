import { describe, expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`

function parseInput(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(""))
}

function checkForX(values: string[][], x: number, y: number) {
	if (values[y - 1]?.[x - 1] === "M") {
		if (values[y + 1]?.[x - 1] === "M") {
			return values[y - 1]?.[x + 1] === "S" && values[y + 1]?.[x + 1] === "S"
		}
		if (values[y - 1]?.[x + 1] === "M") {
			return values[y + 1]?.[x - 1] === "S" && values[y + 1]?.[x + 1] === "S"
		}
		return false
	}
	if (values[y + 1]?.[x + 1] === "M") {
		if (values[y + 1]?.[x - 1] === "M") {
			return values[y - 1]?.[x - 1] === "S" && values[y - 1]?.[x + 1] === "S"
		}
		if (values[y - 1]?.[x + 1] === "M") {
			return values[y - 1]?.[x - 1] === "S" && values[y + 1]?.[x - 1] === "S"
		}
		return false
	}
	return false
}

function calculateValue(input: string) {
	const values = parseInput(input)
	let found = 0
	for (let y = 0; y < values.length; y++) {
		for (let x = 0; x < values[y].length; x++) {
			if (values[y][x] === "A") {
				if (checkForX(values, x, y)) {
					found++
				}
			}
		}
	}
	return found
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(9)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(0)
	})
})

import { describe, expect, test } from "bun:test"
import { MultiMap, getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`

function parseInput(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(""))
}

function calculateValue(input: string) {
	const values = parseInput(input)
	const h = values.length
	const w = values[0].length

	const nodes = new MultiMap<string, [number, number]>()
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (values[y][x] !== ".") {
				nodes.add(values[y][x], [x, y])
			}
		}
	}

	const antiNodes = new Set<string>()
	for (const coords of nodes.values()) {
		for (let i = 0; i < coords.length; i++) {
			antiNodes.add(`${coords[i][0]},${coords[i][1]}`)
			for (let j = i + 1; j < coords.length; j++) {
				let [x1, y1] = coords[i]
				let [x2, y2] = coords[j]
				const dx = x2 - x1
				const dy = y2 - y1
				while (x1 - dx >= 0 && x1 - dx < w && y1 - dy >= 0 && y1 - dy < h) {
					antiNodes.add(`${x1 - dx},${y1 - dy}`)
					x1 -= dx
					y1 -= dy
				}
				while (x2 + dx >= 0 && x2 + dx < w && y2 + dy >= 0 && y2 + dy < h) {
					antiNodes.add(`${x2 + dx},${y2 + dy}`)
					x2 += dx
					y2 += dy
				}
			}
		}
	}

	return antiNodes.size
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(34)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(0)
	})
})

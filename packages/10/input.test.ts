import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`

function parse(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split("").map(Number))
}

function trailScore(
	map: number[][],
	prev: number,
	nextPos: [number, number],
	path: Set<string>,
): number {
	const [x, y] = nextPos

	// Only check each path once
	if (path.has(`${x},${y}`)) return 0
	path.add(`${x},${y}`)

	// Check if the next position is valid
	if (x < 0 || y < 0 || x >= map[0].length || y >= map.length) return 0

	const v = map[y][x]
	if (v !== prev + 1) return 0
	if (v === 9) return 1
	return (
		trailScore(map, v, [x, y + 1], new Set(path)) +
		trailScore(map, v, [x, y - 1], new Set(path)) +
		trailScore(map, v, [x + 1, y], new Set(path)) +
		trailScore(map, v, [x - 1, y], new Set(path))
	)
}

function calc(input: string) {
	const map = parse(input)

	let score = 0
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			const v = map[y][x]
			if (v === 0) {
				score += trailScore(map, -1, [x, y], new Set())
			}
		}
	}

	return score
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(81)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

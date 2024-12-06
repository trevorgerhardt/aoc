import { describe, expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`

function parseInput(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.trim().split(""))
}

function findCaret(map: string[][]): [number, number] {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === "^") {
				map[y][x] = "."
				return [x, y]
			}
		}
	}
	throw new Error("Caret not found")
}

function findInifiniteLoopObstacles(
	map: string[][],
	initialPosition: [number, number],
	obstaclePosition: [number, number],
): boolean {
	const distinctPositionsWithDirection = new Set<string>()
	let dir: "^" | "v" | ">" | "<" = "^"
	let [x, y] = initialPosition
	const [ox, oy] = obstaclePosition
	while (x >= 0 && y >= 0 && x < map[0].length && y < map.length) {
		if (distinctPositionsWithDirection.has(`${x},${y},${dir}`)) {
			return true
		}
		distinctPositionsWithDirection.add(`${x},${y},${dir}`)
		if (dir === "^") {
			if (map[y - 1]?.[x] === "#" || (x === ox && y - 1 === oy)) dir = ">"
			else y--
		} else if (dir === ">") {
			if (map[y][x + 1] === "#" || (x + 1 === ox && y === oy)) dir = "v"
			else x++
		} else if (dir === "v") {
			if (map[y + 1]?.[x] === "#" || (x === ox && y + 1 === oy)) dir = "<"
			else y++
		} else if (dir === "<") {
			if (map[y][x - 1] === "#" || (x - 1 === ox && y === oy)) dir = "^"
			else x--
		}
	}
	return false
}

function calculateValue(input: string) {
	const map = parseInput(input)
	const initialPosition = findCaret(map)
	let obstacles = 0
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (x === initialPosition[0] && y === initialPosition[1]) continue
			if (map[y][x] === "#") continue
			if (findInifiniteLoopObstacles(map, initialPosition, [x, y])) {
				obstacles++
			}
		}
	}
	return obstacles
}

describe(`2024-${DAY}`, () => {
	test("example", () => {
		expect(calculateValue(exampleInput)).toBe(6)
	})

	test("input", async () => {
		const input = await getInput(DAY)
		expect(calculateValue(input)).toBe(1618)
	})
})

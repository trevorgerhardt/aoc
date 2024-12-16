import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
####################
##....[]....[]..[]##
##............[]..##
##..[][]....[]..[]##
##....[]@.....[]..##
##[]##....[]......##
##[]....[]....[]..##
##..[][]..[]..[][]##
##........[]......##
####################

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`

type Move = "<" | ">" | "^" | "v"
type Pos = { x: number; y: number }

const MOVES: Record<Move, Pos> = {
	"<": { x: -1, y: 0 },
	">": { x: 1, y: 0 },
	"^": { x: 0, y: -1 },
	v: { x: 0, y: 1 },
} as const

function parse(input: string) {
	const [map, moves] = input.trim().split("\n\n")

	return {
		map: map
			.trim()
			.split("\n")
			.map((row) => row.split("")),
		moves: moves
			.trim()
			.split("")
			.filter((m) => m in MOVES) as (keyof typeof MOVES)[],
	}
}

function scoreBoxes(map: string[][]) {
	let score = 0
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === "[") {
				score += y * 100 + x
			}
		}
	}
	return score
}

function moveRobotAndBoxes(map: string[][], p: Pos, v: Pos) {
	const nextX = p.x + v.x
	const nextY = p.y + v.y
	const nextCell = map[nextY][nextX]
	if (nextCell === "#") return false
	if (nextCell === ".") return true
	if (nextCell === "O" && moveRobotAndBoxes(map, { x: nextX, y: nextY }, v)) {
		map[nextY + v.y][nextX + v.x] = "O"
		return true
	}
	return false
}

function calc(input: string) {
	const { map, moves } = parse(input)

	const robot = { x: 0, y: 0 }
	robot.y = map.findIndex((row) => {
		robot.x = row.findIndex((cell) => cell === "@")
		return robot.x !== -1
	})

	for (const m of moves) {
		const move = MOVES[m]
		if (moveRobotAndBoxes(map, robot, move)) {
			map[robot.y][robot.x] = "."
			robot.x += move.x
			robot.y += move.y
			map[robot.y][robot.x] = "@"
		}
	}

	return scoreBoxes(map)
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(9021)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

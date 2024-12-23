import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
029A
980A
179A
456A
379A
`

function parse(input: string) {
	return input.trim().split("\n")
}

const numPad: string[][] = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	["", "0", "A"],
]

type Step = "<" | ">" | "^" | "v" | "A" | ""

const dirPad: Step[][] = [
	["", "^", "A"],
	["<", "v", ">"],
]

const dirMap = {
	"<": { x: -1, y: 0 },
	">": { x: 1, y: 0 },
	"^": { x: 0, y: -1 },
	v: { x: 0, y: 1 },
} as const

function validPos(pos: { x: number; y: number }, pad: string[][]) {
	return (
		pos.x >= 0 &&
		pos.x < pad[0].length &&
		pos.y >= 0 &&
		pos.y < pad.length &&
		pad[pos.y][pos.x] !== ""
	)
}

function allValidPositions(
	start: { x: number; y: number },
	steps: Step[],
	pad: string[][],
) {
	let pos = { ...start }
	for (const step of steps) {
		if (step === "" || step === "A") throw new Error("Invalid step")
		const d = dirMap[step]
		pos = { x: pos.x + d.x, y: pos.y + d.y }
		if (!validPos(pos, pad)) return false
	}
	return true
}

function getStepsBetween(
	pos: { x: number; y: number },
	end: { x: number; y: number },
	pad: string[][],
) {
	const steps: Step[] = []
	const start = { ...pos }
	while (pos.x !== end.x || pos.y !== end.y) {
		while (pos.y < end.y) {
			steps.push("v")
			pos.y++
		}
		while (pos.x > end.x) {
			steps.push("<")
			pos.x--
		}
		while (pos.y > end.y) {
			steps.push("^")
			pos.y--
		}
		while (pos.x < end.x) {
			steps.push(">")
			pos.x++
		}
	}

	if (!allValidPositions(start, steps, pad)) return steps.toReversed()
	return steps
}

function mapMoves(pad: string[][]): Record<string, string> {
	const allMoves: Record<string, string> = {}
	for (let y = 0; y < pad.length; y++) {
		for (let x = 0; x < pad[y].length; x++) {
			const b1 = pad[y][x]
			if (b1 === "") continue

			for (let y2 = 0; y2 < pad.length; y2++) {
				for (let x2 = 0; x2 < pad[y2].length; x2++) {
					const b2 = pad[y2][x2]
					if (b2 === "") continue
					allMoves[`${b1}${b2}`] = [
						...getStepsBetween({ x, y }, { x: x2, y: y2 }, pad),
						"A",
					].join("")
				}
			}
		}
	}
	return allMoves
}

function findShortestSeq(code: string, robots = 2): number {
	const numPadMoves = mapMoves(numPad)
	const dirPadMoves = mapMoves(dirPad)

	// Track total moves for each possible key move pairing
	let moves: Record<string, number> = {}
	// Prepend with A (the starting position)
	const aCode = `A${code}`
	for (let i = 0; i < aCode.length - 1; i++) {
		const steps = numPadMoves[`${aCode[i]}${aCode[i + 1]}`]
		let moveKey = `A${steps.substring(0, 1)}`
		moves[moveKey] = (moves[moveKey] || 0) + 1
		for (let j = 0; j < steps.length - 1; j++) {
			moveKey = steps[j] + steps[j + 1]
			moves[moveKey] = (moves[moveKey] || 0) + 1
		}
	}

	// Expand the set of moves required to make the parent robots moves
	for (let i = 0; i < robots; i++) {
		const newMoves: Record<string, number> = {}
		for (const [move, total] of Object.entries(moves)) {
			const steps = dirPadMoves[move]
			let moveKey = `A${steps.substring(0, 1)}`
			newMoves[moveKey] = (newMoves[moveKey] || 0) + total
			for (let j = 0; j < steps.length - 1; j++) {
				moveKey = steps[j] + steps[j + 1]
				newMoves[moveKey] = (newMoves[moveKey] || 0) + total
			}
		}
		moves = newMoves
	}

	return Object.values(moves).reduce((acc, total) => acc + total, 0)
}

function calc(input: string, robots = 2) {
	const codes = parse(input)
	return codes.reduce((acc, code) => {
		return acc + findShortestSeq(code, robots) * Number.parseInt(code)
	}, 0)
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput, 2)).toBe(126384)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input, 25))
})

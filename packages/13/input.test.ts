import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`

type Game = {
	ax: number
	ay: number
	bx: number
	by: number
	px: number
	py: number
}

function parse(input: string): Game[] {
	return input
		.trim()
		.split("\n\n")
		.map((line) => {
			const [buttonA, buttonB, prize] = line.split("\n")
			const [ax, ay] = (buttonA.match(/\d+/g) ?? []).map(Number)
			const [bx, by] = (buttonB.match(/\d+/g) ?? []).map(Number)
			const [px, py] = (prize.match(/\d+/g) ?? []).map(Number)
			return {
				ax,
				ay,
				bx,
				by,
				px: px + 10000000000000,
				py: py + 10000000000000,
			}
		})
}

function moves({ px, py, ax, ay, bx, by }: Game): number {
	// Denominator for solving am
	const d = ax * by - ay * bx
	if (d === 0) return 0

	// Compute the floating-point value for am
	const amFloat = (px * by - py * bx) / d

	let minTokens = Number.POSITIVE_INFINITY
	for (const am of [Math.floor(amFloat), Math.ceil(amFloat)]) {
		// Check if both bmx and bmy produce the same value
		const bmx = (px - am * ax) / bx
		const bmy = (py - am * ay) / by
		if (bmx === bmy && bmx >= 0 && Number.isInteger(bmx)) {
			minTokens = Math.min(minTokens, 3 * am + bmx)
		}
	}

	return minTokens === Number.POSITIVE_INFINITY ? 0 : minTokens
}

function calc(input: string) {
	const games = parse(input)

	return games.map(moves).reduce((a, b) => a + b, 0)
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(875318608908)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

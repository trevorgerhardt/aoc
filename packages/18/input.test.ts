import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`

function parse(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(",").map(Number))
}

function calcMinSteps(
	map: string[][],
	start: { x: number; y: number },
	end: { x: number; y: number },
) {
	const minStepCost = new Map<string, number>()
	const queue: { x: number; y: number; steps: number; lastStep: string }[] = [
		{ x: start.x, y: start.y, steps: 0, lastStep: "" },
	]

	while (queue.length > 0) {
		const curr = queue.shift()
		if (!curr) throw new Error("No current")
		if (curr.x === end.x && curr.y === end.y) return curr.steps

		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		]) {
			const nx = curr.x + dx
			const ny = curr.y + dy
			if (nx < 0 || ny < 0 || nx >= map.length || ny >= map[0].length) continue
			if (map[ny][nx] === "#") continue
			if (curr.lastStep === `${nx},${ny}`) continue
			const currStepCost = minStepCost.get(`${nx},${ny}`)
			if (currStepCost && currStepCost <= curr.steps + 1) continue
			minStepCost.set(`${nx},${ny}`, curr.steps + 1)
			queue.push({
				x: nx,
				y: ny,
				steps: curr.steps + 1,
				lastStep: `${curr.x},${curr.y}`,
			})
		}
	}
}

function calc(input: string, steps = 12, size = 7) {
	const values = parse(input)

	const map = Array.from({ length: size }, () =>
		Array.from({ length: size }, () => "."),
	)
	for (let i = 0; i < steps; i++) {
		const [x, y] = values[i]
		map[y][x] = "#"
	}

	let byteCount = steps
	while (true) {
		const minSteps = calcMinSteps(
			map,
			{ x: 0, y: 0 },
			{ x: size - 1, y: size - 1 },
		)
		if (minSteps === undefined) break
		const [x, y] = values[byteCount]
		map[y][x] = "#"
		byteCount++
	}
	return values[byteCount - 1]
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toEqual([6, 1])
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input, 1024, 71))
})

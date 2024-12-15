import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`

function parse(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => {
			const [p, v] = line.split(" ")
			const [px, py] = p.split(",")
			const [vx, vy] = v.split(",")
			return {
				p: { x: Number(px.slice(2)), y: Number(py) },
				v: { x: Number(vx.slice(2)), y: Number(vy) },
			}
		})
}

async function calc(input: string, h = 7, w = 11) {
	const robots = parse(input)

	let bestDensityFactor = 0
	let bestDensityFactorSeconds = 0
	for (let s = 1; s < 10_000; s++) {
		const grid = Array.from({ length: h }, () =>
			Array.from({ length: w }, () => "."),
		)
		for (const robot of robots) {
			const p = robot.p
			const v = robot.v
			const np = { x: (p.x + v.x) % w, y: (p.y + v.y) % h }
			if (np.x < 0) np.x += w
			if (np.y < 0) np.y += h
			robot.p = np
			grid[np.y][np.x] = "#"
		}

		let sumDist = 0
		let pairCount = 0
		for (let i = 0; i < robots.length; i++) {
			for (let j = i + 1; j < robots.length; j++) {
				const p1 = robots[i].p
				const p2 = robots[j].p
				const dist = Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
				sumDist += dist
				pairCount++
			}
		}

		const avgDist = sumDist / pairCount
		const maxDist = h - 1 + (w - 1)
		const densityFactor = 1 - avgDist / maxDist

		if (densityFactor > bestDensityFactor) {
			bestDensityFactor = densityFactor
			bestDensityFactorSeconds = s
		}
	}

	return bestDensityFactorSeconds
}

test.skip(`2024-${DAY}: Example`, async () => {
	expect(await calc(exampleInput)).toBe(12)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", await calc(input, 103, 101))
})

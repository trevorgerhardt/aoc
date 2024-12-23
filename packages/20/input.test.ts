import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`

function parse(input: string) {
	const s = { x: 0, y: 0 }
	const e = { x: 0, y: 0 }
	const m = input
		.trim()
		.split("\n")
		.map((l, y) => {
			const line = l.split("")
			for (const [i, v] of line.entries()) {
				if (v === "S") {
					s.x = i
					s.y = y
				}
				if (v === "E") {
					e.x = i
					e.y = y
				}
			}
			return line
		})
	return { m, s, e }
}

type Node = {
	x: number
	y: number
	cheat: number
}

type Path = Node[]

function timeToEnd(
	m: string[][],
	s: { x: number; y: number },
	cheatDistance = 2,
	maxSteps: number = Number.MAX_SAFE_INTEGER,
) {
	const queue: Path[] = [[{ x: s.x, y: s.y, cheat: cheatDistance }]]
	const allPaths: Path[] = []

	const viewed = new Set<string>()

	while (queue.length > 0) {
		const currentPath = queue.shift()
		if (!currentPath) throw new Error("No path")
		const currentNode = currentPath[currentPath.length - 1]
		const { x, y, cheat } = currentNode

		const key = `${x},${y}-${cheat}`
		if (viewed.has(key)) continue
		viewed.add(key)

		if (currentPath.length > maxSteps) continue
		if (m[y][x] === "E") {
			allPaths.push(currentPath)
			continue
		}

		const nextSteps: Node[] = [
			{ x: x + 1, y, cheat },
			{ x: x - 1, y, cheat },
			{ x, y: y + 1, cheat },
			{ x, y: y - 1, cheat },
		] as const

		for (const step of nextSteps) {
			if (
				step.x < 0 ||
				step.y < 0 ||
				step.x >= m[0].length ||
				step.y >= m.length
			) {
				continue
			}
			if (currentPath.some((p) => p.x === step.x && p.y === step.y)) continue
			if (m[step.y][step.x] === "#") {
				if (step.cheat === 0) continue
				step.cheat -= cheatDistance
			}
			queue.push([...currentPath, step])
		}
	}

	console.log(viewed)

	return allPaths.toSorted((a, b) => a.length - b.length)
}

function calc(input: string, cheat = 2, saved = 2) {
	const { m, s, e } = parse(input)

	const baselinePaths = timeToEnd(m, s, 0)
	// Steps includes start and end
	const baselineSteps = baselinePaths[0].length - 1
	console.log("BASELINE", baselineSteps)
	const pathsToEnd = timeToEnd(m, s, cheat, baselinePaths[0].length - saved)

	const uniqueStartEnd = new Set(
		pathsToEnd.map((p) => {
			const i = p.findIndex((n) => n.cheat === 0)
			const [a, b] = [p[i], p[i + 1]]
			return `${a.x},${a.y}-${b.x},${b.y}`
		}),
	)

	return uniqueStartEnd.size
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput, 2, 2)).toBe(44)
})

test.skip(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input, 2, 100))
})

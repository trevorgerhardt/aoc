import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`

function parse(input: string) {
	return input
		.trim()
		.split("\n")
		.map((row) => row.split(""))
}

type Direction = 0 | 1 | 2 | 3

interface State {
	x: number
	y: number
	dir: Direction
}

// Directions: up, right, down, left
const directions = [
	{ dx: 0, dy: -1 },
	{ dx: 1, dy: 0 },
	{ dx: 0, dy: 1 },
	{ dx: -1, dy: 0 },
]

function findPath(
	start: State,
	end: { x: number; y: number },
	map: string[][],
	stepPenalty = 1,
	turnPenalty = 1000,
): State[][] {
	const h = map.length
	const w = map[0].length

	// Priority queue using a min-heap approach
	class PriorityQueue<T> {
		private heap: { item: T; priority: number }[] = []
		enqueue(item: T, priority: number) {
			this.heap.push({ item, priority })
			this.heap.sort((a, b) => a.priority - b.priority)
		}
		dequeue(): T {
			const item = this.heap.shift()
			if (!item) throw new Error("Priority queue is empty")
			return item.item
		}
		isEmpty() {
			return this.heap.length === 0
		}
	}

	const isPassable = (x: number, y: number) =>
		x >= 0 && x < w && y >= 0 && y < h && map[y][x] === "."

	const stateKey = (s: State) => `${s.x},${s.y},${s.dir}`

	// Store the minimal cost found so far to reach each state
	const dist: { [key: string]: number } = {}
	// Store all parents for each state at the minimal cost
	const parents: { [key: string]: State[] } = {}

	dist[stateKey(start)] = 0
	parents[stateKey(start)] = []

	const open = new PriorityQueue<State>()
	open.enqueue(start, 0)

	let bestCostToEnd = Number.POSITIVE_INFINITY
	while (!open.isEmpty()) {
		const current = open.dequeue()
		const currentKey = stateKey(current)
		const currentCost = dist[currentKey]

		// If this state's cost is already worse than known best cost to end, skip
		if (currentCost > bestCostToEnd) continue

		// Check if we've reached end (position-wise; direction doesn't matter)
		if (current.x === end.x && current.y === end.y) {
			// Update best cost if this is better or equal
			if (currentCost < bestCostToEnd) {
				bestCostToEnd = currentCost
			}
			// Don't break immediately; we want to ensure we explore all minimal paths
			continue
		}

		for (const nextDir of [0, 1, 2, 3] as Direction[]) {
			const { dx, dy } = directions[nextDir]
			const nx = current.x + dx
			const ny = current.y + dy

			if (!isPassable(nx, ny)) continue

			const costToMove =
				stepPenalty + (nextDir === current.dir ? 0 : turnPenalty)
			const newCost = currentCost + costToMove
			// If we already know a better cost than bestCostToEnd, no need to proceed
			if (newCost > bestCostToEnd) continue

			const nextState: State = { x: nx, y: ny, dir: nextDir }
			const nk = stateKey(nextState)

			if (dist[nk] === undefined || newCost < dist[nk]) {
				dist[nk] = newCost
				parents[nk] = [current]
				open.enqueue(nextState, newCost)
			} else if (Math.abs(dist[nk] - newCost) <= 0) {
				// Another equally good parent
				parents[nk].push(current)
			}
		}
	}

	// Reconstruct all minimal paths
	const allPaths: State[][] = []

	// Gather all end states that have the bestCostToEnd
	const endStates: State[] = []
	for (const key in dist) {
		const [sx, sy, sdir] = key.split(",").map(Number)
		if (sx === end.x && sy === end.y && dist[key] === bestCostToEnd) {
			endStates.push({ x: sx, y: sy, dir: sdir as Direction })
		}
	}

	// Recursive function to rebuild all paths
	function rebuildPaths(state: State, pathSoFar: State[]) {
		const sk = stateKey(state)
		if (parents[sk].length === 0) {
			// This must be the start
			allPaths.push(pathSoFar.slice().reverse())
			return
		}
		for (const p of parents[sk]) {
			pathSoFar.push(p)
			rebuildPaths(p, pathSoFar)
			pathSoFar.pop()
		}
	}

	for (const es of endStates) {
		rebuildPaths(es, [es])
	}

	return allPaths
}

function calc(input: string) {
	const map = parse(input)
	const pos: State = { x: 0, y: 0, dir: 1 }
	pos.y = map.findIndex((row) => {
		pos.x = row.findIndex((cell) => cell === "S")
		return pos.x !== -1
	})

	const end = { x: 0, y: 0 }
	end.y = map.findIndex((row) => {
		end.x = row.findIndex((cell) => cell === "E")
		return end.x !== -1
	})

	map[end.y][end.x] = "."

	return new Set(
		findPath(pos, end, map)
			.flat()
			.map((p) => `${p.x},${p.y}`),
	).size
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(45)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

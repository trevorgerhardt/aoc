import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`

function parse(input: string) {
	return input
		.trim()
		.split("\n")
		.map((line) => line.split(""))
}

function findRegion(
	s: string,
	x: number,
	y: number,
	garden: string[][],
	region: Point[],
	visited: Set<string>,
) {
	if (visited.has(`${x},${y}`)) return region
	if (
		y < 0 ||
		y >= garden.length ||
		x < 0 ||
		x >= garden[y].length ||
		s !== garden[y][x]
	)
		return region

	region.push({ x, y })
	visited.add(`${x},${y}`)

	findRegion(s, x + 1, y, garden, region, visited)
	findRegion(s, x - 1, y, garden, region, visited)
	findRegion(s, x, y + 1, garden, region, visited)
	findRegion(s, x, y - 1, garden, region, visited)

	return region
}

type Point = { x: number; y: number }
type Edge = { p1: Point; p2: Point }
const p2s = (p: Point) => `${p.x},${p.y}`

function calc(input: string) {
	const garden = parse(input)

	const width = garden[0].length
	const height = garden.length
	const regions: Point[][] = []
	const visited = new Set<string>()
	let totalCost = 0
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (visited.has(`${x},${y}`)) continue

			const region = findRegion(garden[y][x], x, y, garden, [], visited)
			regions.push(region)
		}
	}

	for (const region of regions) {
		const area = region.length
		const s = garden[region[0].y][region[0].x]
		const leftEdge: Edge[] = []
		const rightEdge: Edge[] = []
		const topEdge: Edge[] = []
		const bottomEdge: Edge[] = []
		for (const { x, y } of region) {
			if (x === 0 || garden[y][x - 1] !== s)
				leftEdge.push({
					p1: { x, y },
					p2: { x, y: y + 1 },
				})
			if (x === width - 1 || garden[y][x + 1] !== s)
				rightEdge.push({
					p1: { x: x + 1, y },
					p2: { x: x + 1, y: y + 1 },
				})
			if (y === 0 || garden[y - 1][x] !== s)
				topEdge.push({
					p1: { x, y },
					p2: { x: x + 1, y },
				})
			if (y === height - 1 || garden[y + 1][x] !== s)
				bottomEdge.push({
					p1: { x, y: y + 1 },
					p2: { x: x + 1, y: y + 1 },
				})
		}

		let totalSides = 0
		for (const edges of [leftEdge, rightEdge, topEdge, bottomEdge]) {
			const sides = new Map<string, Point[]>()
			for (const edge of edges) {
				const { p1, p2 } = edge
				const s1 = sides.get(p2s(p1))
				const s2 = sides.get(p2s(p2))

				if (s1 && s2) {
					s1.push(p1)
					s1.push(p2)
					sides.set(p2s(p1), s1)
					sides.set(p2s(p2), s1)
					if (s1 !== s2) {
						for (const p of s2) {
							s1.push(p)
							sides.set(p2s(p), s1)
						}
						totalSides -= 1
					}
				} else if (s1) {
					s1.push(p2)
					sides.set(p2s(p2), s1)
				} else if (s2) {
					s2.push(p1)
					sides.set(p2s(p1), s2)
				} else {
					const newSide = [p1, p2]
					sides.set(p2s(p1), newSide)
					sides.set(p2s(p2), newSide)
					totalSides += 1
				}
			}
		}

		totalCost += area * totalSides
	}

	return totalCost
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(1206)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

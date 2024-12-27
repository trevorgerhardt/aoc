import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`

function parse(input: string) {
	return input
		.trim()
		.split("\n\n")
		.map((kl) => kl.split("\n").map((l) => l.split("")))
}

function calc(input: string) {
	const keylocks = parse(input)
	const maxHeight = keylocks[0].length - 1
	const locks = keylocks
		.filter((k) => k[0][0] === "#")
		.map((lock) => {
			const heights = []
			for (let x = 0; x < lock[0].length; x++) {
				heights.push(lock.findIndex((col) => col[x] !== "#") - 1)
			}
			return heights
		})

	const keys = keylocks
		.filter((k) => k[0][0] !== "#")
		.map((key) => {
			const heights = []
			for (let x = 0; x < key[0].length; x++) {
				heights.push(maxHeight - key.findIndex((col) => col[x] === "#"))
			}
			return heights
		})

	let workingKeys = 0
	for (const lock of locks) {
		for (const key of keys) {
			if (lock.every((v, i) => v + key[i] < maxHeight)) workingKeys++
		}
	}

	return workingKeys
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(3)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

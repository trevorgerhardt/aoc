import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
2333133121414131402
`

function parse(input: string): number[] {
	return (input.trim().match(/\d/g) ?? []).map(Number)
}

function calc(input: string) {
	const values = parse(input)
	const contents: { id: number; size: number }[] = []
	const disk: (number | ".")[] = []
	let id = 0
	for (let i = 0; i < values.length; i++) {
		const size = values[i]
		if (i % 2 === 0) {
			disk.push(...Array(size).fill(id))
			contents.push({ id, size })
			id++
		} else {
			disk.push(...Array(size).fill("."))
		}
	}

	// Work backwards from largest
	contents.reverse()

	for (const content of contents) {
		if (content == null) continue
		const { id, size } = content
		const contentIndex = disk.findIndex((v, i) => {
			if (v !== id) return false
			return disk.slice(i, i + size).every((x) => x === id)
		})
		const emptyIndex = disk.findIndex((v, i) => {
			if (v !== ".") return false
			return disk.slice(i, i + size).every((x) => x === ".")
		})
		if (emptyIndex !== -1 && emptyIndex < contentIndex) {
			for (let j = 0; j < size; j++) {
				disk[emptyIndex + j] = id
				disk[contentIndex + j] = "."
			}
		}
	}

	let checksum = 0
	for (let i = 0; i < disk.length; i++) {
		const v = disk[i]
		if (v !== ".") {
			checksum += i * v
		}
	}

	return checksum
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(2858)
})

test(`2024-${DAY}: Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nResult 👇\n", calc(input))
})

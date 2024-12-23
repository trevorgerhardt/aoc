import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`

function parse(input: string): { t: string[]; d: string[] } {
	const [t, d] = input.trim().split("\n\n")
	return {
		t: (t.match(/\w+/g) ?? []).toSorted((a, b) => a.length - b.length),
		d: d.split("\n").toSorted((a, b) => a.length - b.length),
	}
}

function validDesigns(
	design: string,
	towels: Record<string, number>,
	designs: Record<string, number>,
): number {
	if (design in towels) return towels[design]
	if (design in designs) return designs[design]

	const nextTowels = Object.keys(towels).filter((towel) =>
		design.startsWith(towel),
	)
	let validPaths = 0
	for (const towel of nextTowels) {
		const towelHasValidDesigns = validDesigns(
			design.slice(towel.length),
			towels,
			designs,
		)
		if (towelHasValidDesigns > 0) {
			validPaths += towelHasValidDesigns
		}
	}

	designs[design] = validPaths
	return validPaths
}

function calc(input: string) {
	const { t, d } = parse(input)

	const designs: Record<string, number> = {}
	const towels: Record<string, number> = {}
	for (const towel of t) {
		towels[towel] =
			towel.length === 1 ? 1 : validDesigns(towel, towels, designs) + 1
	}

	return d.reduce((acc, design) => {
		return acc + validDesigns(design, towels, designs)
	}, 0)
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(16)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

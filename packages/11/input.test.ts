import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
125 17
`

function parse(input: string) {
	return input.trim().split(" ")
}

let timesCalled = 0
function blink(
	stoneStr: string,
	blinksLeft: number,
	blinkCache = new Map<string, number>(),
): number {
	timesCalled++
	if (blinksLeft === 0) return stoneStr.split(" ").length

	const key = `${blinksLeft}:${stoneStr}`
	const cached = blinkCache.get(key)
	if (cached) return cached

	let totalStones = 0
	for (const s of parse(stoneStr)) {
		const l = `${s}`.length
		if (s === "0") {
			totalStones += blink("1", blinksLeft - 1, blinkCache)
		} else if (l % 2 === 0) {
			totalStones += blink(
				`${s.slice(0, l / 2)} ${Number(s.slice(l / 2))}`,
				blinksLeft - 1,
				blinkCache,
			)
		} else {
			totalStones += blink(`${Number(s) * 2024}`, blinksLeft - 1, blinkCache)
		}
	}

	blinkCache.set(key, totalStones)
	return totalStones
}

function calc(input: string, blinks = 25) {
	return blink(input, blinks)
}

test(`2024-${DAY}: Example`, () => {
	timesCalled = 0
	expect(calc(exampleInput)).toBe(55312)
	console.log(timesCalled)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	timesCalled = 0
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input, 75))
	console.log(timesCalled)
})

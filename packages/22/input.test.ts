import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
1
2
3
2024
`

function parse(input: string) {
	return input.trim().split("\n").map(BigInt)
}

const mix = (v: bigint, m: bigint) => v ^ m
const prune = (v: bigint, p = 16777216n) => v % p

function calc(input: string) {
	const prices = parse(input)
	const seqs = new Map<string, number>()

	for (let s of prices) {
		const seen = new Set<string>()
		const seq: number[] = []
		let prevBananas = Number(s % 10n)
		for (let i = 0; i < 2000; i++) {
			s = prune(mix(s, s * 64n))
			s = prune(mix(s, s / 32n))
			s = prune(mix(s, s * 2048n))
			const bananas = Number(s % 10n)
			const diff = bananas - prevBananas
			prevBananas = bananas

			seq.push(diff)
			if (seq.length === 4) {
				const uniqSeq = seq.join(",")
				if (!seen.has(uniqSeq)) {
					seen.add(uniqSeq)
					seqs.set(uniqSeq, (seqs.get(uniqSeq) ?? 0) + bananas)
				}
				seq.shift()
			}
		}
	}

	return Math.max(...seqs.values())
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(23)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

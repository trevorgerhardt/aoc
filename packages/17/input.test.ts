import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`

function parse(input: string) {
	const [registers, program] = input.trim().split("\n\n")
	return {
		registers: registers.split("\n").map((line) => BigInt(line.split(": ")[1])),
		program: program.split(": ")[1].split(",").map(Number),
	}
}

function run(program: number[], registers: bigint[]) {
	const getCombo = (v: number) => (v > 3 ? registers[v - 4] : BigInt(v))
	const instructions = [
		(o: number) => {
			registers[0] = registers[0] / 2n ** getCombo(o)
		},
		(o: number) => {
			registers[1] ^= BigInt(o)
		},
		(o: number) => {
			registers[1] = getCombo(o) % 8n
		},
		(o: number) => {
			if (registers[0] !== 0n) return o - 2
		},
		(_: number) => {
			registers[1] ^= registers[2]
		},
		(o: number) => {
			outputs.push(Number(getCombo(o) % 8n))
		},
		(o: number) => {
			registers[1] = registers[0] / 2n ** getCombo(o)
		},
		(o: number) => {
			registers[2] = registers[0] / 2n ** getCombo(o)
		},
	] as const

	const outputs: number[] = []
	for (let i = 0; i < program.length; i += 2) {
		i = instructions[program[i]](program[i + 1]) ?? i
	}

	return outputs
}

function findMinInput(program: number[]): bigint | undefined {
	const stack: { a: bigint; idx: number }[] = [{ a: 0n, idx: 0 }]

	while (stack.length > 0) {
		const curr = stack.pop()
		if (!curr) throw new Error("No current")
		if (curr.idx === program.length) return curr.a

		for (let i = 7n; i >= 0n; i--) {
			if (curr.a + i === 0n) continue
			const nextA = curr.a * 8n + i
			const output = run(program, [nextA, 0n, 0n])
			const pSlice = program.slice(program.length - curr.idx - 1).join(",")
			const oSlice = output.slice(-pSlice.length).join(",")
			if (pSlice === oSlice) {
				stack.push({ a: nextA, idx: curr.idx + 1 })
			}
		}
	}

	throw new Error("No solution found")
}

function calc(input: string) {
	const { program } = parse(input)

	return findMinInput(program)
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe(117440n)
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

import { describe, expect, it } from "bun:test"
import { getInput } from "./utils"

const CURRENT_DAY = new Date().getDate()
const TEST_DAYS: number[] = []

describe("days", async () => {
	for (const DAY of TEST_DAYS) {
		const input = await getInput(DAY)
		const day = await import(`./days/${DAY}.ts`)
		describe(`day ${DAY}`, () => {
			describe("pt1", () => {
				it("example", () => {
					expect(day.getResult1(day.exampleInput1)).toBe(day.result1)
				})

				it("input", () => {
					expect(day.getResult1(input)).toBe(day.result1)
				})
			})

			describe("pt2", () => {
				it("example", () => {
					expect(day.getResult2(day.exampleInput2)).toBe(day.result2)
				})

				it("input", () => {
					expect(day.getResult2(input)).toBe(day.result2)
				})
			})
		})
	}
})

import { describe, expect, test } from "bun:test"
import { calculateValue } from "."

describe("template", () => {
	test("calculateValue", () => {
		expect(calculateValue()).toBe(0)
	})
})

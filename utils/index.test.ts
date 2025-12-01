import { expect, test } from "bun:test"

test("cookie should be set", () => {
	expect(process.env.COOKIE).toBeDefined()
})

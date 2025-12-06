import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = "DAY";

export const P1: Part = {
  exampleInput: ``,
  exampleResult: 0,
  result: 0,
  getResult: (input: string) => {
    return 0;
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 0,
  result: 0,
  getResult: (input: string) => {
    return 0;
  },
};

const input = await getInput(DAY);
test("pt1 example", () => {
  expect(P1.getResult(P1.exampleInput)).toBe(P1.exampleResult);
});

test("pt1", () => {
  expect(P1.getResult(input)).toBe(P1.result);
});

test("pt2 example", () => {
  expect(P2.getResult(P2.exampleInput)).toBe(P2.exampleResult);
});

test("pt2", () => {
  expect(P2.getResult(input)).toBe(P2.result);
});

import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = 12;

export const P1: Part = {
  exampleInput: `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`,
  exampleResult: 0,
  result: 0,
  getResult: (input: string) => {
    const sections = input.trim().split("\n\n")
    const shapes = sections.slice(0, -1).map(s => s.split("\n")
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

import { expect, test } from "bun:test";
import { getInput, transpose } from "../utils";
import type { Part } from "../types";

const DAY = 6;

export const P1: Part = {
  exampleInput: `
123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +
    `.trim(),
  exampleResult: 4277556,
  result: 5171061464548,
  getResult: (input: string) => {
    const allRows = input.split("\n");
    const exps = allRows[allRows.length - 1]
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => e === "*" || e === "+");
    const results: number[] = exps.map((e) => (e === "*" ? 1 : 0));
    for (let i = 0; i < allRows.length - 1; i++) {
      const row = [...allRows[i].matchAll(/\d+/g)].map(Number);
      for (let j = 0; j < row.length; j++) {
        if (exps[j] === "*") {
          results[j] *= row[j];
        } else if (exps[j] === "+") {
          results[j] += row[j];
        }
      }
    }
    return results.reduce((acc, cur) => acc + cur, 0);
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 3263827,
  result: 10189959087258,
  getResult: (input: string) => {
    const t = transpose(
      input
        .split("\n")
        .filter((s) => s.trim().length !== 0)
        .map((s) => s.split("")),
    ).toReversed();
    let total = 0;
    let p: number[] = [];
    for (let i = 0; i < t.length; i++) {
      const vStr = t[i]
        .slice(0, -1)
        .filter((v) => v != null && v != " ")
        .join("");
      if (vStr.length > 0) p.push(Number(vStr));
      const cExp = (t[i][t[i].length - 1] ?? " ") as "+" | "*" | " ";
      if (cExp !== " ") {
        total += p.reduce((a, c) => (cExp === "*" ? a * c : a + c));
        p = [];
      }
    }
    return total;
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

import { describe, expect, it } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = "DAY";

export const P1: Part = {
  exampleInput: ``,
  exampleResult: 0,
  result: 0,
  getResult: (input) => {
    return 0;
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 0,
  result: 0,
  getResult: (input) => {
    return 0;
  },
};

describe(`day ${DAY}`, async () => {
  const input = await getInput(DAY);
  describe("pt1", () => {
    it("example", () => {
      expect(P1.getResult(P1.exampleInput)).toBe(P1.exampleResult);
    });

    it("input", () => {
      expect(P1.getResult(input)).toBe(P1.result);
    });
  });

  describe("pt2", () => {
    it("example", () => {
      expect(P2.getResult(P2.exampleInput)).toBe(P2.exampleResult);
    });

    it("input", () => {
      expect(P2.getResult(input)).toBe(P2.result);
    });
  });
});

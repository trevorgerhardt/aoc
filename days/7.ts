import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = 7;

export const P1: Part = {
  exampleInput: `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
  `,
  exampleResult: 21,
  result: 1543,
  getResult: (input: string) => {
    const grid = input
      .trim()
      .split("\n")
      .map((l) => l.split(""));
    const startX = grid[0].findIndex((c) => c === "S");
    let splits = 0;
    let beams = new Set<number>([startX]);
    for (let y = 1; y < grid.length; y++) {
      const nextBeams = new Set<number>();
      const addBeam = (x: number) => {
        if (grid[0][x]) {
          nextBeams.add(x);
          return true;
        }
        return false;
      };
      for (const beam of beams) {
        const c = grid[y][beam];
        if (c === ".") nextBeams.add(beam);
        else if (c === "^") {
          const addLeft = addBeam(beam - 1);
          const addRight = addBeam(beam + 1);
          if (addLeft || addRight) splits++;
        }
      }
      beams = nextBeams;
    }
    return splits;
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 40,
  result: 3223365367809,
  getResult: (input: string) => {
    const grid = input
      .trim()
      .split("\n")
      .map((l) => l.split(""));
    const startX = grid[0].findIndex((c) => c === "S");
    const seenTimeline = new Map<string, number>();
    const timelines = (x: number, y: number): number => {
      const key = `${x},${y}`;
      if (seenTimeline.has(key)) return seenTimeline.get(key)!;
      let t = 0;
      if (!grid[y]) t = 1;
      else if (grid[y][x] === "^")
        t = timelines(x - 1, y) + timelines(x + 1, y);
      else t = timelines(x, y + 1);
      seenTimeline.set(key, t);
      return t;
    };
    return timelines(startX, 1);
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

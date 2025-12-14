import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";
import pointInPolygon from "point-in-polygon-hao";

const DAY = 9;

type Point = [x: number, y: number];

export const P1: Part = {
  exampleInput: `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
  exampleResult: 50,
  result: 4790063600,
  getResult: (input: string) => {
    const coords = input
      .trim()
      .split("\n")
      .map((l) => l.split(",").map(Number));
    return coords
      .flatMap(([x1, y1], i) =>
        coords
          .slice(i + 1)
          .map(([x2, y2]) => (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)),
      )
      .toSorted((a, b) => b - a)[0];
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 24,
  result: 1516172795,
  getResult: (input: string) => {
    const redTiles = input
      .trim()
      .split("\n")
      .map((l) => l.split(",").map(Number) as Point);

    const polygon = [...redTiles, redTiles[0]];

    const rects = redTiles
      .flatMap((a, i) =>
        redTiles.slice(i + 1).map((b) => {
          const area =
            (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1);
          return { a, b, area } as const;
        }),
      )
      .toSorted((a, b) => b.area - a.area);

    const inSideCache = new Map<string, boolean>();
    const pip = (x: number, y: number) => {
      const xyStr = `${x},${y}`;
      if (!inSideCache.has(xyStr)) {
        const inSide = pointInPolygon([x, y], [polygon]);
        inSideCache.set(xyStr, inSide !== false);
      }
      return inSideCache.get(xyStr)!;
    };
    const rectInPolygon = (a: Point, b: Point) => {
      for (let x = Math.min(a[0], b[0]) + 1; x < Math.max(a[0], b[0]); x++) {
        if (!pip(x, a[1])) return false;
        if (!pip(x, b[1])) return false;
      }
      for (let y = Math.min(a[1], b[1]) + 1; y < Math.max(a[1], b[1]); y++) {
        if (!pip(a[0], y)) return false;
        if (!pip(b[0], y)) return false;
      }
      return true;
    };
    for (const { a, b, area } of rects) {
      if (rectInPolygon(a, b)) return area;
    }
    throw Error("No rectangle found!");
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

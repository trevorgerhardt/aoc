import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = 8;

type Point = [x: number, y: number, z: number];
const distance = (p1: Point, p2: Point) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const dz = p2[2] - p1[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};
const pointStr = (p: Point) => `${p[0]},${p[1]},${p[2]}`;

export const P1: Part = {
  exampleInput: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
  exampleResult: 40,
  result: 54180,
  getResult: ([input, pairs]: [string, number]) => {
    const boxes = input
      .split("\n")
      .map((r) => r.split(",").map(Number) as Point);
    const distances = boxes
      .flatMap((b1, i) =>
        boxes
          .slice(i + 1)
          .map((b2) => [b1, b2, distance(b1, b2)] as [Point, Point, number]),
      )
      .toSorted((a, b) => a[2] - b[2])
      .slice(0, pairs);
    const circuits: Set<string>[] = [];
    for (const conn of distances) {
      const [b1, b2] = [pointStr(conn[0]), pointStr(conn[1])];
      const c1Index = circuits.findIndex((c) => c.has(b1));
      const c2Index = circuits.findIndex((c) => c.has(b2));

      if (c1Index !== -1) {
        const c1 = circuits[c1Index];
        c1.add(b1);
        c1.add(b2);
        if (c1Index !== c2Index && c2Index !== -1) {
          for (const c of circuits.splice(c2Index, 1)[0]) c1.add(c);
        }
      } else if (c2Index !== -1) {
        const c2 = circuits[c2Index];
        c2.add(b1);
        c2.add(b2);
      } else {
        circuits.push(new Set([b1, b2]));
      }
    }
    return circuits
      .map((c) => c.size)
      .toSorted((a, b) => b - a)
      .slice(0, 3)
      .reduce((acc, cur) => acc * cur);
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 25272,
  result: 25325968,
  getResult: (input: string) => {
    const boxes = input
      .trim()
      .split("\n")
      .map((r) => r.split(",").map(Number) as Point);
    const distances = boxes
      .flatMap((b1, i) =>
        boxes
          .slice(i + 1)
          .map((b2) => [b1, b2, distance(b1, b2)] as [Point, Point, number]),
      )
      .toSorted((a, b) => a[2] - b[2]);
    const circuits: Set<string>[] = [];
    const seen = new Set<string>();
    for (const conn of distances) {
      const [b1, b2] = [pointStr(conn[0]), pointStr(conn[1])];
      const c1Index = circuits.findIndex((c) => c.has(b1));
      const c2Index = circuits.findIndex((c) => c.has(b2));

      if (c1Index !== -1) {
        const c1 = circuits[c1Index];
        c1.add(b1);
        c1.add(b2);
        if (c1Index !== c2Index && c2Index !== -1) {
          for (const c of circuits.splice(c2Index, 1)[0]) c1.add(c);
        }
      } else if (c2Index !== -1) {
        const c2 = circuits[c2Index];
        c2.add(b1);
        c2.add(b2);
      } else {
        circuits.push(new Set([b1, b2]));
      }

      seen.add(b1);
      seen.add(b2);

      if (seen.size === boxes.length && circuits.length === 1) {
        return conn[0][0] * conn[1][0];
      }
    }
    throw Error("No solution!");
  },
};

const input = await getInput(DAY);
test("pt1 example", () => {
  expect(P1.getResult([P1.exampleInput, 10])).toBe(P1.exampleResult);
});

test("pt1", () => {
  expect(P1.getResult([input, 1_000])).toBe(P1.result);
});

test("pt2 example", () => {
  expect(P2.getResult(P2.exampleInput)).toBe(P2.exampleResult);
});

test("pt2", () => {
  expect(P2.getResult(input)).toBe(P2.result);
});

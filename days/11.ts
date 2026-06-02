import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = 11;

export const P1: Part = {
  exampleInput: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
  exampleResult: 5,
  result: 466,
  getResult: (input: string) => {
    const flows = Object.fromEntries(
      input.split("\n").map((l) => {
        const parts = l.split(" ");
        return [parts[0].slice(0, -1), parts.slice(1)];
      }),
    );
    const seen = new Map<string, number>();
    const checkPath = (path: string[], to: string) => {
      const input = path[path.length - 1];
      if (flows[input].includes(to)) {
        return 1;
      }
      if (seen.has(input)) return seen.get(input)!;
      let paths = 0;
      for (const o of flows[input]) {
        paths += checkPath([...path, o], "out");
      }
      seen.set(input, paths);
      return paths;
    };

    return checkPath(["you"], "out");
  },
};

export const P2: Part = {
  exampleInput: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
  exampleResult: 2,
  result: 0,
  getResult: (input: string) => {
    const flows = Object.fromEntries(
      input
        .trim()
        .split("\n")
        .map((l) => {
          const parts = l.split(" ");
          return [parts[0].slice(0, -1), parts.slice(1)];
        }),
    );
    const seen = new Map<string, number>();
    const checkPath = (path: string[], to: string) => {
      const input = path[path.length - 1];
      if (flows[input].includes(to)) {
        return 1;
      }
      if (seen.has(input)) return seen.get(input)!;
      let paths = 0;
      for (const o of flows[input]) {
        newPath = [...path, o];
        paths += checkPath(newPath, "out");
        checkPath(newPath, "dac");
        checkPath(newPath, "");
      }
      seen.set(input, paths);
      return paths;
    };

    return checkPath(["svr"]);
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

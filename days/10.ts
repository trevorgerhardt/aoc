import { test, expect } from "bun:test";
import { getInput } from "../utils";
import type { Part } from "../types";

const DAY = 10;

export const P1: Part = {
  exampleInput: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
  exampleResult: 7,
  result: 547,
  getResult: (input: string) => {
    const machines = input
      .trim()
      .split("\n")
      .map((l) => {
        const row = l.split(" ");
        let indicator = 0;
        row[0]
          .slice(1, -1)
          .split("")
          .forEach((p, i) => {
            if (p === "#") indicator ^= 1 << i;
          });
        const buttons = row
          .slice(1, -1)
          .map((b) => b.slice(1, -1).split(",").map(Number))
          .map((b) => {
            let button = 0;
            for (const i of b) {
              button ^= 1 << i;
            }
            return button;
          });
        return { indicator, buttons };
      });
    let totalPresses = 0;
    const calculatePresses = (indicator: number, buttons: number[]) => {
      let lights = [0];
      let p = 0;
      while (true) {
        p++;
        const newLights: number[] = [];
        for (let i = 0; i < buttons.length; i++) {
          for (const light of lights) {
            const newLight = light ^ buttons[i];
            if (newLight === indicator) return p;
            newLights.push(newLight);
          }
        }
        lights = newLights;
      }
      throw Error("Failed");
    };
    for (const machine of machines) {
      totalPresses += calculatePresses(machine.indicator, machine.buttons);
    }
    return totalPresses;
  },
};

export const P2: Part = {
  exampleInput: P1.exampleInput,
  exampleResult: 33,
  result: 0,
  getResult: (input: string) => {
    const machines = input
      .trim()
      .split("\n")
      .map((l) => {
        const row = l.split(" ");
        const buttons = row
          .slice(1, -1)
          .map((b) => b.slice(1, -1).split(",").map(Number));
        const joltage = row.slice(-1)[0].slice(1, -1).split(",").map(Number);
        return { joltage, buttons };
      });
    let totalPresses = 0;
    const calculatePresses = (joltage: number[], buttons: number[][]) => {
      let joltages: number[][] = [new Array(joltage.length).fill(0)];
      console.log(joltage, joltages, buttons);
      let p = 0;
      const jeq = (j: number[]) => j.every((v, i) => v === joltage[i]);
      const jlte = (j: number[]) => j.every((v, i) => v <= joltage[i]);
      while (p < 13) {
        p++;
        const newJoltages: number[][] = [];
        for (const button of buttons) {
          for (const j of joltages) {
            const newJoltage = [...j];
            for (const i of button) newJoltage[i]++;
            if (jeq(newJoltage)) return p;
            if (jlte(newJoltage)) newJoltages.push(newJoltage);
          }
        }
        joltages = newJoltages;
      }
      throw Error("Failed");
    };
    for (const machine of machines) {
      const presses = calculatePresses(machine.joltage, machine.buttons);
      console.log(presses);
      totalPresses += presses;
    }
    return totalPresses;
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

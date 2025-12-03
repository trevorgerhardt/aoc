export const exampleInput1 = `987654321111111
811111111111119
234234234234278
818181911112111`;
export const exampleResult1 = 357;
export const result1 = 16842;
export const getResult1 = (input: typeof exampleInput1) => {
  let t = 0;
  for (const b of input
    .split("\n")
    .map((b) => b.trim().split("").map(Number))) {
    const l = b.slice(0, -1).reduce((l, c) => (c > l ? c : l), 0);
    const r = b
      .slice(b.findIndex((v) => v === l) + 1)
      .reduce((r, c) => (c > r ? c : r), 0);
    const j = Number(`${l}${r}`);
    t += j;
  }
  return t;
};

export const exampleInput2 = exampleInput1;
export const exampleResult2 = 3121910778619;
export const result2 = 167523425665348;
export const getResult2 = (input: typeof exampleInput2) => {
  let t = 0;
  for (const b of input
    .split("\n")
    .map((b) => b.trim().split("").map(Number))) {
    const j: number[] = [];
    let lastIndex = 0;
    while (j.length < 12) {
      let i = lastIndex;
      const end = b.length - (12 - j.length);
      for (let d = lastIndex + 1; d <= end; d++) {
        if (b[d] > b[i]) i = d;
      }
      j.push(b[i]);
      lastIndex = i + 1;
    }

    t += Number(j.join(""));
  }
  return t;
};

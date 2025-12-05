export const exampleInput1 = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
export const exampleResult1 = 3;
export const result1 = 707;
export const getResult1 = (input: typeof exampleInput1) => {
  const [fresh, ingredients] = input
    .split("\n\n")
    .map((c) => c.split("\n").map((r) => r.split("-").map(Number)));
  let t = 0;
  for (const i of ingredients) {
    for (const f of fresh) {
      if (i[0] >= f[0] && i[0] <= f[1]) {
        t++;
        break;
      }
    }
  }
  return t;
};

export const exampleInput2 = exampleInput1;
export const exampleResult2 = 14;
export const result2 = 361615643045059;

function shouldMerge(r1: number[], r2: number[]) {
  return (
    (r1[0] >= r2[0] && r1[0] <= r2[1]) || // r1 min inside r2
    (r1[1] >= r2[0] && r1[1] <= r2[1]) || // r1 max inside r2
    (r1[0] <= r2[0] && r1[1] >= r2[1]) || // r1 contains r2
    (r2[0] <= r1[0] && r2[1] >= r1[1]) // r2 contains r1
  );
}

function merge(r: number[][]) {
  for (let i = 0; i < r.length - 1; i++)
    for (let j = i + 1; j < r.length; j++)
      if (shouldMerge(r[i], r[j])) {
        r[i] = [Math.min(...r[i], ...r[j]), Math.max(...r[i], ...r[j])];
        return merge(r.toSpliced(j, 1));
      }
  return r;
}

export const getResult2 = (input: typeof exampleInput2) => {
  const [fresh] = input
    .split("\n\n")
    .map((c) => c.split("\n").map((r) => r.split("-").map(Number)));
  return merge(fresh).reduce((totalFresh, range) => {
    return totalFresh + (range[1] - range[0] + 1);
  }, 0);
};

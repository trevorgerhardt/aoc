export const exampleInput1 = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
export const exampleResult1 = 13;
export const result1 = 1602;
export const getResult1 = (input: typeof exampleInput1) => {
  const grid = input.split("\n").map((l) => l.split(""));
  let t = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        let adj = 0;
        for (let j = y - 1; j <= y + 1; j++) {
          if (j < 0 || j >= grid.length) continue;
          for (let i = x - 1; i <= x + 1; i++) {
            if (i < 0 || i >= grid[y].length) continue;
            if (grid[j][i] === "@") adj++;
          }
        }
        if (adj <= 4) {
          t++;
        }
      }
    }
  }
  return t;
};

export const exampleInput2 = exampleInput1;
export const exampleResult2 = 43;
export const result2 = 9518;
export const getResult2 = (input: typeof exampleInput2) => {
  const grid = input.split("\n").map((l) => l.split(""));
  let t = 0;

  const removePaper = () => {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "@") {
          let adj = 0;
          for (let j = y - 1; j <= y + 1; j++) {
            if (j < 0 || j >= grid.length) continue;
            for (let i = x - 1; i <= x + 1; i++) {
              if (i < 0 || i >= grid[y].length) continue;
              if (grid[j][i] === "@") adj++;
            }
          }
          if (adj <= 4) {
            grid[y][x] = ".";
            return true;
          }
        }
      }
    }
    return false;
  };

  while (removePaper()) t++;
  return t;
};

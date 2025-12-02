export const exampleInput1 = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;
export const exampleResult1 = 1227775554;
export const result1 = 34826702005;
export const getResult1 = (input: typeof exampleInput1) => {
  let iids = 0;
  const isInvalid = (n: number) => {
    const s = n.toString();
    if (s.length % 2 === 1) return false;
    return s.slice(0, s.length / 2) === s.slice(s.length / 2);
  };
  for (const [f, l] of input
    .split(",")
    .map((set) => set.split("-").map(Number))) {
    for (let id = f; id <= l; id++) {
      if (isInvalid(id)) iids += id;
    }
  }
  return iids;
};

export const exampleInput2 = exampleInput1;
export const exampleResult2 = 4174379265;
export const result2 = 43287141963;
export const getResult2 = (input: typeof exampleInput2) => {
  let iids = 0;
  const isInvalid = (n: number) => {
    const s = n.toString();
    const l = s.length;
    if (l < 2) return false;
    if ([...s].every((v) => v === s[0])) return true;

    for (let size = 2; size <= l / 2; size++) {
      if (l % size !== 0) continue;
      const seq = s.slice(0, size);
      let allMatch = true;
      for (let j = size; j <= l - size; j += size) {
        const next = s.slice(j, j + size);
        if (next !== seq) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) return true;
    }
    return false;
  };
  for (const [f, l] of input
    .split(",")
    .map((set) => set.split("-").map(Number))) {
    for (let id = f; id <= l; id++) {
      if (isInvalid(id)) {
        iids += id;
      }
    }
  }
  return iids;
};

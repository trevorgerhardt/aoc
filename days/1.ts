export const exampleInput1 = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`
export const exampleResult1 = 3

export const exampleInput2 = exampleInput1
export const exampleResult2 = 6

export const result1 = 964
export const result2 = 5872

export const getResult1 = (input: typeof exampleInput1) => {
	const instructions = input.split("\n")
	let p = 50
	let c = 0
	for (const i of instructions) {
		const dir = i[0]
		const steps = Number(i.slice(1))
		p = (dir === "L" ? p - steps : p + steps) % 100
		if (p === 0) c++
	}
	return c
}

export const getResult2 = (input: typeof exampleInput2) => {
	const instructions = input.split("\n")
	let p = 50
	let c = 0
	for (const [dir, ...s] of instructions) {
		const steps = Number(s.join(""))
		for (let i = 0; i < steps; i++) {
			p += dir === "L" ? -1 : 1
			if (p < 0) p += 100
			if (p > 99) p -= 100
			if (p === 0) c++
		}
	}
	return c
}

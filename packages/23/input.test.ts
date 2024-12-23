import { expect, test } from "bun:test"
import { getInput } from "../utils"
import { name as DAY } from "./package.json"

const exampleInput = ` 
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`

type Computer = {
	name: string
	conns: Record<string, Computer>
}

function parse(input: string): Computer[] {
	const comps: Record<string, Computer> = {}
	input
		.trim()
		.split("\n")
		.map((line) => {
			const [a, b] = line.split("-")
			if (!comps[a]) comps[a] = { name: a, conns: {} }
			if (!comps[b]) comps[b] = { name: b, conns: {} }
			comps[a].conns[b] = comps[b]
			comps[b].conns[a] = comps[a]
		})
	return Object.values(comps)
}

function isCluster(cluster: Computer[]): boolean {
	for (let i = 0; i < cluster.length; i++)
		for (let j = i + 1; j < cluster.length; j++)
			if (!cluster[i].conns[cluster[j].name]) return false
	return true
}

function findClusters(
	currentCluster: Computer[],
	remaining: Computer[],
): Computer[] {
	if (remaining.length === 0) {
		return currentCluster
	}

	let largestCluster: Computer[] = [...currentCluster]
	for (let i = 0; i < remaining.length; i++) {
		const newNode = remaining[i]
		const newCluster = [...currentCluster, newNode]

		if (isCluster(newCluster)) {
			const cluster = findClusters(newCluster, remaining.slice(i + 1))
			if (cluster.length > largestCluster.length) {
				largestCluster = cluster
			}
		}
	}

	return largestCluster
}

function calc(input: string) {
	return findClusters([], parse(input))
		.map((c) => c.name)
		.toSorted()
		.join(",")
}

test(`2024-${DAY}: Example`, () => {
	expect(calc(exampleInput)).toBe("co,de,ka,ta")
})

test(`2024-${DAY}: Copy Result 👆`, async () => {
	const input = await getInput(DAY)
	console.log("\nCopy Result 👇\n", calc(input))
})

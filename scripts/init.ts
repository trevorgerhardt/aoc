#! /usr/bin/env bun

import { existsSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"

const DAY = process.argv[2]

if (!DAY) {
	console.error("DAY is required. Run `bun run init.ts <day>`")
	process.exit(1)
}

const currentDir = import.meta.dirname
const packagesDir = resolve(currentDir, "../packages")
const templateDir = `${packagesDir}/template`
const dayDir = `${packagesDir}/${DAY}`

console.log(`Creating 2024-${DAY}`)

if (existsSync(dayDir)) {
	console.error(`${dayDir} already exists`)
	process.exit(1)
}
mkdirSync(dayDir)

const packageJsonPath = `${templateDir}/package.json`
const packageJson = JSON.parse(await Bun.file(packageJsonPath).text())
packageJson.name = DAY
await Bun.write(`${dayDir}/package.json`, JSON.stringify(packageJson, null, 2))

const file = Bun.file(`${templateDir}/input.test.ts`)
await Bun.write(`${dayDir}/input.test.ts`, file)

console.log(`Created 2024-${DAY}`)

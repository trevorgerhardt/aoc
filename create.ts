import { getInput } from "./utils";

const TODAY = new Date().getDate();
const TODAY_PATH = `days/${TODAY}.ts`;
if (await Bun.file(TODAY_PATH).exists())
  throw Error(`${TODAY_PATH} already exists. Will not overwrite.`);
console.log(`Creating new day: ${TODAY}`);
const templateText = await Bun.file(`days/template.ts`).text();
const dayText = templateText.replace(`"DAY"`, String(TODAY));
await Bun.write(`days/${TODAY}.ts`, dayText);
console.log(`Fetching input for day: ${TODAY}`);
await getInput(TODAY);
console.log("Done!");

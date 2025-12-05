import { getInput } from "./utils";

const TODAY = new Date().getDate();
console.log(`Creating new day: ${TODAY}`);
const templateText = await Bun.file(`days/template.ts`).text();
const dayText = templateText.replace(`"DAY"`, String(TODAY));
await Bun.write(`days/${TODAY}.ts`, dayText);
console.log(`Fetching input for day: ${TODAY}`);
await getInput(TODAY);
console.log("Done!");

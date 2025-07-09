/* global console, process */
/* eslint-env node */
import { ESLint } from "eslint";

async function main() {
  const eslint = new ESLint();

  const results = await eslint.lintFiles(["src", "tests"]);

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  if (resultText) {
    console.log(resultText);
  }

  const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);

  if (errorCount === 0) {
    console.log("ESLint: No errors found.");
    process.exit(0);
  } else {
    console.log(`ESLint: Found ${errorCount} error(s).`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

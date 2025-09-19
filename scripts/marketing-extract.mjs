import fs from "fs/promises";
import path from "path";

function getComponentName(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  return baseName
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function createComponentWrapper(componentName, innerJsx) {
  return `"use client";

import React from "react";
// TODO: Import necessary components like HaloButton, icons, etc.

export function ${componentName}() {
  return (
${innerJsx
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  );
}
`;
}

async function main() {
  const args = process.argv.slice(2).reduce((acc, arg) => {
    const [key, value] = arg.split("=");
    acc[key.replace("--", "")] = value;
    return acc;
  }, {});

  const { source, target, name } = args;

  if (!source || !target) {
    console.error("🚨 Usage: npm run refactor:marketing -- --source=<path> --target=<path> [--name=<ComponentName>]");
    process.exit(1);
  }

  try {
    console.log(`🚀 Extracting marketing section from ${source}...`);

    const sourceContent = await fs.readFile(source, "utf-8");

    const jsxMatch = sourceContent.match(/<(?<tag>\w+)(.|\n)*<\/\k<tag>>/);
    if (!jsxMatch) {
      throw new Error("Could not find a top-level JSX element in the source file.");
    }
    let innerJsx = jsxMatch[0];

    console.log("🔧 Applying initial transformations...");
    innerJsx = innerJsx.replace(/className="px-\[5%\]"/g, 'className="layout-edge"');
    console.log('   - Replaced `px-[5%]` with `layout-edge`.');

    const componentName = name || getComponentName(target);
    const newFileContent = createComponentWrapper(componentName, innerJsx);

    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, newFileContent, "utf-8");

    console.log(`✅ Successfully created new component at ${target}`);
  } catch (error) {
    console.error(`🔥 Error during extraction: ${error.message}`);
    process.exit(1);
  }
}

main();
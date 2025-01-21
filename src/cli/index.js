const fs = require("fs");
const readline = require("readline");
const path = require("path");

const { getRootFolder } = require("../utils/get-root-folder");
const { handlePrompt } = require("../utils/handle-prompt");
const { readFile } = require("../utils/handle-file");

async function handleInitializeConfigFile({ rootFolder }) {
  let canConfigure = false;
  let configFileContent = {};
  canConfigure = await handlePrompt({
    readline: readline,
    question:
      "remove-console-config.json file not found do you want to configure it ? (Y / N).",
    type: "y/no",
  });

  if (canConfigure) {
    configFileContent = await handlePrompt({
      question: "Enter the path for your code source directory:",
      type: "text",
      key: "root_dir",
      readline: readline,
      configFileContent: configFileContent,
    });
    configFileContent = await handlePrompt({
      question: "Did you have ';' in your end code statement ? ( Y / N).",
      type: "text",
      key: "has-semi-collin",
      readline: readline,
      configFileContent: configFileContent,
    });
    fs.writeFile(
      `${rootFolder}/remove-console-config.json`,
      JSON.stringify(configFileContent),
      function (err) {
        if (err) throw err;
      }
    );
  }
}

async function handleFiles({ fileContent }) {
  const rootDir = fileContent.root_dir || fileContent;
  const fileList = fs.readdirSync(rootDir);

  // Filter required files based on extensions
  const requiredFiles = fileList.filter((file) => {
    const fileExtension = path.extname(file).slice(1);
    return ["js", "jsx", "ts", "tsx", ""].includes(fileExtension);
  });

  // Process each required file
  for (const fileName of requiredFiles) {
    const filePath = path.join(rootDir, fileName);
    const fileExtension = path.extname(fileName).slice(1);

    if (fileExtension) {
      try {
        const fileData = await fs.promises.readFile(filePath, "utf-8");

        // Remove all console.log statements
        const updatedContent = fileData.replace(/console\.log\(.*?\);?/g, "");

        // Write the updated content back to the file
        if (fileData !== updatedContent) {
          await fs.promises.writeFile(filePath, updatedContent, "utf-8");
          console.log(`Updated file: ${fileName}`);
        }
      } catch (error) {
        console.error(`Error processing file: ${fileName}`, error);
      }
    } else {
      // Handle directories recursively
      await handleFiles({ fileContent: filePath });
    }
  }
}

async function handleRemoveConsole() {
  const rootFolder = getRootFolder();
  console.log("CLI Initialized...");
  let configFileContent = await readFile(
    `${rootFolder}/remove-console-config.json`,
    fs
  );
  let fileContent = JSON.parse(configFileContent?.data || "{}");

  if (configFileContent?.err) {
    await handleInitializeConfigFile({ rootFolder: rootFolder });

    setTimeout(async () => {
      configFileContent = await readFile(
        `${rootFolder}/remove-console-config.json`,
        fs
      );
      fileContent = JSON.parse(configFileContent.data);
      handleFiles({ fileContent: fileContent });
    }, 1000);
  } else if (!fileContent.root_dir) {
    await handleInitializeConfigFile({ rootFolder: rootFolder });

    setTimeout(async () => {
      configFileContent = await readFile(
        `${rootFolder}/remove-console-config.json`,
        fs
      );
      fileContent = JSON.parse(configFileContent.data);
      handleFiles({ fileContent: fileContent });
    }, 1000);
  } else {
    await handleFiles({ fileContent: fileContent });
  }
}

handleRemoveConsole();

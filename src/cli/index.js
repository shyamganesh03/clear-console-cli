#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { exec } = require("child_process");

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
      question:
        "Enter the file extensions from which you want to remove console.log (comma-separated) with out Dot notation eg: js,ts,etc..,. If not specified, default values will be used.:",
      type: "text",
      key: "included_files_extensions",
      readline: readline,
      configFileContent: configFileContent,
      isArray: true,
      defaultValue: ["js", "jsx", "ts", "tsx"],
    });
    configFileContent = await handlePrompt({
      question:
        "Enter the file or folder name to exclude. If not specified, default values will be used.:",
      type: "text",
      key: "excluded_folders",
      readline: readline,
      configFileContent: configFileContent,
      isArray: true,
      defaultValue: ["node_modules"],
    });

    configFileContent = await handlePrompt({
      question: "Enter the script command to run prettier:",
      type: "text",
      key: "prettier_run_command",
      readline: readline,
      configFileContent: configFileContent,
      defaultValue: "format:fix",
    });
    configFileContent = await handlePrompt({
      question:
        "Enter the node version manager name which one would you like to use ? (npm or yarn or pnpm):",
      type: "text",
      key: "node_version_manager",
      readline: readline,
      configFileContent: configFileContent,
      defaultValue: "npm",
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

async function handleFiles({
  fileContent,
  includedFileExtensionFromConfigFile = [],
  excludedFolders = [],
}) {
  const rootDir = fileContent.root_dir || fileContent;
  const fileList = fs.readdirSync(rootDir);
  const includedFileExtension = [...includedFileExtensionFromConfigFile, ""];

  // Filter required files based on extensions
  const requiredFiles = fileList.filter((file) => {
    const fileExtension = path.extname(file).slice(1);
    return (
      includedFileExtension.includes(fileExtension) &&
      !excludedFolders.includes(file)
    );
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
      await handleFiles({
        fileContent: filePath,
        includedFileExtensionFromConfigFile:
          includedFileExtensionFromConfigFile,
        excludedFolders: excludedFolders,
      });
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
      await handleFiles({
        fileContent: fileContent,
        includedFileExtensionFromConfigFile:
          fileContent.included_files_extensions,
        excludedFolders: fileContent.excluded_folders,
      });
    }, 1000);
  } else if (!fileContent.root_dir) {
    await handleInitializeConfigFile({ rootFolder: rootFolder });

    setTimeout(async () => {
      configFileContent = await readFile(
        `${rootFolder}/remove-console-config.json`,
        fs
      );
      fileContent = JSON.parse(configFileContent.data);
      await handleFiles({
        fileContent: fileContent,
        includedFileExtensionFromConfigFile:
          fileContent.included_files_extensions,
        excludedFolders: fileContent.excluded_folders,
      });
    }, 1000);
  } else {
    await handleFiles({
      fileContent: fileContent,
      includedFileExtensionFromConfigFile:
        fileContent.included_files_extensions,
      excludedFolders: fileContent.excluded_folders,
    });
  }
  exec(
    `${fileContent.node_version_manager}${
      fileContent.node_version_manager === "npm" ? " run " : " "
    }${fileContent.prettier_run_command} `,
    (error, stdout, stderr) => {
      if (error) {
        if (
          error.message.includes(
            `'prettier' is not recognized as an internal or external command,`
          )
        )
          console.log(
            "prettier is not installed please config prettier to auto format your Repo."
          );
        else console.log(`error: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(stdout);
    }
  );
}

handleRemoveConsole();

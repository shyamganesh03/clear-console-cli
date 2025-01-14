const fs = require("fs");
const readline = require("readline");

const { getRootFolder } = require("../utils/get-root-folder");
const { handlePrompt } = require("../utils/handle-prompt");

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

async function readFile(path) {
  return new Promise((resolve) => {
    fs.readFile(path, "utf-8", async function (err, data) {
      if (err) resolve({ err });
      else {
        resolve({ data });
      }
    });
  });
}
async function handleFiles({ fileContent }) {
  const fileList = fs.readdirSync(fileContent.root_dir);
  const requiredFiles = fileList.filter((file) => {
    const fileExtension = file.split(".")[1];
    return (
      fileExtension === "js" ||
      fileExtension === "jsx" ||
      fileExtension === "ts" ||
      fileExtension === "tsx"
    );
  });
  requiredFiles.map(async (fileName) => {
    let copiedContent = "";
    let requiredFileContent = await readFile(
      `${fileContent.root_dir}/${fileName}`
    );
    if (requiredFileContent.err) {
      throw requiredFileContent.err;
    } else {
      copiedContent = requiredFileContent.data;
      const regex = /console\.log\((.*?)\)/g;
      const matches = [...copiedContent.matchAll(regex)];

      matches?.forEach((matchedContent) => {
        copiedContent = copiedContent.replaceAll(`${matchedContent[0]};`, "");
      });
      if (copiedContent !== null)
        fs.writeFile(
          `${fileContent.root_dir}/${fileName}`,
          copiedContent,
          function (err) {
            if (err) throw err;
            else console.log("The Task has been completed Successfully!");
          }
        );
    }
  });
}
async function handleRemoveConsole() {
  const rootFolder = getRootFolder();
  console.log("CLI Initialized...");
  let configFileContent = await readFile(
    `${rootFolder}/remove-console-config.json`
  );
  let fileContent = JSON.parse(configFileContent?.data || "{}");

  if (configFileContent?.err) {
    await handleInitializeConfigFile({ rootFolder: rootFolder });

    setTimeout(async () => {
      configFileContent = await readFile(
        `${rootFolder}/remove-console-config.json`
      );
      fileContent = JSON.parse(configFileContent.data);
      handleFiles({ fileContent: fileContent });
    }, 1000);
  } else if (!fileContent.root_dir) {
    await handleInitializeConfigFile({ rootFolder: rootFolder });

    setTimeout(async () => {
      configFileContent = await readFile(
        `${rootFolder}/remove-console-config.json`
      );
      fileContent = JSON.parse(configFileContent.data);
      handleFiles({ fileContent: fileContent });
    }, 1000);
  } else {
    await handleFiles({ fileContent: fileContent });
  }
}

handleRemoveConsole();

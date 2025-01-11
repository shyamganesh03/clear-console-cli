const fs = require("fs")
const { getRootFolder } = require('../utils/get-root-folder');

async function handleRemoveConsole() {
    const rootFolder = getRootFolder()
  console.log("CLI Initialized...", rootFolder,__dirname);
  // fs.readFile("remove-console-config.json", function (err, data) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   } else {
  //     console.log("first");
  //     const fileContent = JSON.parse(data);
  //     console.log({ fileContent });
  //   }
  // });
}

handleRemoveConsole();
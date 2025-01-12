const fs = require("fs");
const { getRootFolder } = require("../utils/get-root-folder");

async function handleRemoveConsole() {
  const rootFolder = getRootFolder();
  console.log("CLI Initialized...");
  fs.readFile(`${rootFolder}/remove-console-config.json`, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else {
      const fileContent = JSON.parse(data);
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
      requiredFiles.map((fileName) => {
        let copiedContent = "";
        fs.readFile(
          `${fileContent.root_dir}/${fileName}`,
          "utf-8",
          function (err, data) {
            if (err) {
              console.log({ err });
              return;
            } else {
              copiedContent = data;
              const regex = /console\.log\((.*?)\)/g;
              const matches = [...copiedContent.matchAll(regex)];

              matches?.forEach((matchedContent) => {
                copiedContent = copiedContent.replaceAll(
                  `${matchedContent[0]};`,
                  ""
                );
              });
              if (copiedContent !== null)
                fs.writeFile(
                  `${fileContent.root_dir}/${fileName}`,
                  copiedContent,
                  function (err) {
                    if (err) throw err;
                    console.log("Saved!");
                  }
                );
            }
          }
        );
      });
      //

      // if (match) {
      //   console.log("Matched text:", match[1]);
      // }

      console.log("Files and folders in the directory:", requiredFiles);
    }
  });
}

handleRemoveConsole();

export async function readFile(path, fs) {
  return new Promise((resolve) => {
    fs.readFile(path, "utf-8", async function (err, data) {
      if (err) resolve({ err });
      else {
        resolve({ data });
      }
    });
  });
}

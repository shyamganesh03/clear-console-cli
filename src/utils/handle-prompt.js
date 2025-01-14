export async function handlePrompt({
  question,
  type,
  configFileContent,
  key,
  readline,
}) {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askQuestion(query) {
    return new Promise((resolve) => {
      prompt.question(query, (answer) => resolve(answer));
    });
  }

  let userAnswer;

  if (type === "y/no") {
    const answer = await askQuestion(`${question} (Y/N): `);
    if (answer.toUpperCase() === "Y") {
      userAnswer = true;
    } else if (answer.toUpperCase() === "N") {
      userAnswer = false;
    } else {
      console.error("Invalid input. Please enter 'Y' or 'N'.");
      prompt.close();
      process.exit(1);
    }
  } else {
    const answer = await askQuestion(question);
    userAnswer = { ...configFileContent, [key]: answer };
  }

  prompt.close();
  return userAnswer;
}

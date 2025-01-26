export async function handlePrompt({
  question,
  type,
  configFileContent,
  key,
  readline,
  isArray = false,
  defaultValue = [],
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
      userAnswer = {
        ...configFileContent,
        [key]: true,
      };
    } else if (answer.toUpperCase() === "N") {
      userAnswer = {
        ...configFileContent,
        [key]: false,
      };
    } else {
      console.error("Invalid input. Please enter 'Y' or 'N'.");
      prompt.close();
      process.exit(1);
    }
  } else {
    let answer = await askQuestion(question);
    if (isArray) {
      if (!!answer) {
        answer = answer
          .split(",")
          ?.map((splittedStrings) => splittedStrings?.trim())
          ?.filter((splittedStrings) => !!splittedStrings);
      }
    }
    if (!answer) {
      answer = defaultValue;
    }

    userAnswer = {
      ...configFileContent,
      [key]: answer,
    };
  }

  prompt.close();
  return userAnswer;
}

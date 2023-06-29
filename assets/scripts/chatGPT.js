function getAnswerFromChatGPT(question) {
  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0.5,
      max_tokens: 1200,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const answer = data.choices[0].text.trim();
      return answer;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error; // Rethrow the error to be caught by the caller
    });
}

function parseText(text) {
  const description = [];
  const placesName = [];

  const textSections = text.split(`\n`);
  const filteredAnswer = textSections.filter((sentence) => sentence != "");
  const takeFrontSection = [];

  filteredAnswer.forEach(function (section) {
    takeFrontSection.push(section.split(`:`)[0]);

    description.push(section.split(`:`)[1]);
  });

  if (text.includes("1.")) {
    takeFrontSection.forEach(function (listitem) {
      placesName.push(listitem.split(`.`)[1]);
    });
  }

  return {
    pubNames: placesName,
    descriptions: description,
  };
}

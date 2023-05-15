// Globals
var result = null;

async function getAnswerFromChatGPT(question) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": question,
            "temperature": 0.5,
            "max_tokens": 1000,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0
        })
    });

    const data = await response.json();
    console.log(data);
    const answer = data.choices[0].text.trim();
    
    return answer;
}

async function awaitAnswer() {
    const answer = await getAnswerFromChatGPT("Can you give me a list of good parks in London and some info about those parks?");
    console.log("answer: " + answer);
    return answer;
}

awaitAnswer();

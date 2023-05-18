function getAnswerFromChatGPT(question) {
    return fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiKey,
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": question,
            "temperature": 0.5,
            "max_tokens": 500,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0
        })
    })
    .then(response => response.json())
    .then(data => {
      const answer = data.choices[0].text.trim();
      return answer;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; // Rethrow the error to be caught by the caller
    });
  }

  function splitPubData(pubDataString) {
    const pubEntries = pubDataString.split("\n");
    var pubSplit = pubEntries.filter(element => element !== "");
    
    

    const splitArray = pubSplit.map(element => {
        const [pubName, description] = element.split(":");
        // return [pubName.trim(), description.trim()];
      });


    console.log(pubSplit);

    /*
    const pubArray = [];
  
    pubEntries.forEach(entry => {
      const [pubNumber, description] = entry.split(' – ', 2);
      const pubName = description.trim().replace(/^(?:The\s)/, '');
      const pubObject = { [pubName]: description };
      pubArray.push(pubObject);
    });
  
    return pubArray;
    */
  }

  function parseText(text) {
    const textSections = text.split(`\n`);
    const filteredAnswer = textSections.filter(word=> word !="");
    console.log(filteredAnswer);
    const takeFrontSection = [];
    const description = [];
    filteredAnswer.forEach(function (section) {
        if (section.includes(`-`)) {
            takeFrontSection.push(section.split(`-`)[0]);
            description.push(section.split(`-`)[1]);
        } else {
            takeFrontSection.push(section.split(`:`)[0]);
            description.push(section.split(`:`)[1]);
        }
    });


    const placesName = [];
    takeFrontSection.forEach(function (listitem) {
      placesName.push(listitem.split(`.`)[1].trimStart());
    });
    console.log(textSections);
    console.log(takeFrontSection);
    console.log(placesName);
    console.log(description);
    return placesName;
  }
  
  
    var lat = 51.48673532383122;
    var long = -3.1624860861007114;

  // Usage
getAnswerFromChatGPT(`Can you give me a list of good pubs at latitude ${lat} and longitude ${long} and a description of those pubs, separated by colons?`)
    .then(answer => {
      console.log('Answer:', answer);
      // Perform additional operations with the answer
    
    const pubArray = parseText(answer);

    console.log(pubArray);

    
    


    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error appropriately
    });
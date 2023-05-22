async function getAnswerFromChatGPT(question) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
        },

    })}



    
        function on() {
            document.getElementById("overlay").style.display = "block";
          }
          
          function off() {
            document.getElementById("overlay").style.display = "none";
          }
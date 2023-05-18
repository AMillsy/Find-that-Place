// Usage
var lat = 51.48673532383122;
var long = -3.1624860861007114;

let pubObj = {};

getAnswerFromChatGPT(
  `Can you give me a list of good pubs at latitude ${lat} and longitude ${long} and a description of those pubs, separated by colons?`
)
  .then((answer) => {
    // Perform additional operations with the answer

    pubObj = parseText(answer);

    //PREFORM PAGE TRANSFORM
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle the error appropriately
  });

function hidemap() {
  function on() {
    document.getElementById("overlay").style.display = "block";
  }

  function off() {
    document.getElementById("overlay").style.display = "none";
  }
}
// Usage
var lat = 51.48673532383122;
var long = -3.1624860861007114;

let pubObj = {};

// getAnswerFromChatGPT(
//   `Can you give me a list of good pubs at latitude ${lat} and longitude ${long} and a description of those pubs, separated by colons?`
// )
//   .then((answer) => {
//     // Perform additional operations with the answer

//     pubObj = parseText(answer);

//     //PREFORM PAGE TRANSFORM
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//     // Handle the error appropriately
//   });

//Lat and longitude when clicked
let clickedLat, clickedLng;

function getClickedLocation(mapsMouseEvent) {
  const latlon = mapsMouseEvent.latLng.toJSON();
  clickedLat = latlon.lat;
  clickedLng = latlon.lng;
  let locationName = "";
  //GET AREA NAME WHEN CLICKING
  new google.maps.Geocoder().geocode(
    {
      location: mapsMouseEvent.latLng,
    },
    (results, status) => {
      if (status === "OK") {
        if (results && results.length) {
          const filtered_array = results.filter((result) =>
            result.types.includes("locality")
          );
          const addressResult = filtered_array.length
            ? filtered_array[0]
            : results[0];

          if (addressResult.address_components) {
            addressResult.address_components.forEach((component) => {
              if (component.types.includes("locality")) {
                console.log("Found Locality");
                locationName = component.long_name;
                console.log(component);
                findResults([clickedLat, clickedLng], locationName);
              }
            });
          }
        }
      }
    }
  );
}

function findResults([lat, lng], locationName) {
  const point = new google.maps.LatLng(lat, lng);

  marker = map_create_marker(point, locationName, false);
  let pubObj;

  getAnswerFromChatGPT(
    `Can you give me a list of good pubs in ${locationName} and a description of those pubs, separated by colons?`
  )
    .then((answer) => {
      // Perform additional operations with the answer
      pubObj = parseText(answer);

      pubObj.pubNames.forEach(function (pubName, index) {
        const request = {
          query: `${pubName}, ${locationName}`,
          fields: ["name", "geometry", "formatted_address", "photos"],
        };
        findPlace(request, pubName, pubObj.descriptions[index]);
      });
      //PREFORM PAGE TRANSFORM
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle the error appropriately
    });
}

function findLocationByAddress(place) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${key}`
  )
    .then((response) => response.json())
    .then(function (result) {
      console.log(result.results[0].geometry.location);
      const { lat, lng } = result.results[0].geometry.location;

      const point = new google.maps.LatLng(lat, lng);
      gMap.setCenter(point);
      gMap.setZoom(13);
    });
}

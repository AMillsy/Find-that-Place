const recentSearch = document.querySelector(`#recentPlaces`);
let recentLocation = [];

function init() {
  console.log(`INIT START`);
  recentLocations = JSON.parse(localStorage.getItem(`recentLocations`));
  if (!recentLocations) {
    recentLocations = [];
  }

  showRecentSearchs();
}
init();

function stopMapUse() {
  document.getElementById("overlay").style.display = "block";
}

function continueMapUse() {
  document.getElementById("overlay").style.display = "none";
}

let pubObj = {};

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
                locationName = component.long_name;
                storeSearch(locationName);
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
  removeMarkersOnMap();
  clearOutPlaceSection();
  stopMapUse();
  marker = map_create_marker(point, locationName, false);
  let pubObj;

  getAnswerFromChatGPT(
    `Can you give me a list of good pubs in ${locationName} and a description of those pubs, separated by colons?`
  )
    .then((answer) => {
      // Perform additional operations with the answer
      pubObj = parseText(answer);
      continueMapUse();
      pubObj.pubNames.forEach(function (pubName, index) {
        const request = {
          query: `${pubName}, ${locationName}`,
          fields: ["name", "geometry", "formatted_address", "photos", "icon"],
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

function clearOutPlaceSection() {
  const placesContainer = document.querySelector(`.places`);
  placesContainer.innerHTML = "";
}

function showRecentSearchs() {
  recentSearch.innerHTML = "";
  for (const location of recentLocations) {
    console.log(location);
    const html = `<li>${location}</li>`;
    recentSearch.insertAdjacentHTML(`beforeend`, html);
  }
}

function storeSearch(locationName) {
  if (recentLocations.includes(locationName)) {
    const recentSearch = recentLocation.splice(
      recentLocations.indexOf(locationName),
      1
    );
    recentLocations.unshift(...recentSearch);
  } else {
    recentLocations.unshift(locationName);
  }
  console.log("THIS IS THE RECENT SEARCH", locationName);
  console.log(recentLocations);
  localStorage.setItem(`recentLocations`, JSON.stringify(recentLocations));
  showRecentSearchs();
}

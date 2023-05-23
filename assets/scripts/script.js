const recentSearch = document.querySelector(`#recentPlaces`);
let recentLocation = [];
let gMapCircle;
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

  const circle = new google.maps.Circle({
    map: gMap,
    center: point,
    radius: 5000,
  });

  gMapCircle = circle;
  removeMarkersOnMap();
  clearOutPlaceSection();
  stopMapUse();
  removeCircle();
  marker = map_create_marker(point, locationName, false);
  let pubObj;

  getAnswerFromChatGPT(
    `Can you give me a list of good pubs in ${locationName} and a description, separated by colons?`
  )
    .then((answer) => {
      // Perform additional operations with the answer
      pubObj = parseText(answer);
      continueMapUse();
      pubObj.pubNames.forEach(function (pubName, index) {
        const request = {
          query: `${pubName} in ${locationName}`,
          fields: ["name", "geometry", "formatted_address", "photos", "icon"],
          locationBias: circle,
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

function findLocationByAddress(place, searchFromRecent = false) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${key}`
  )
    .then((response) => response.json())
    .then(function (result) {
      const { lat, lng } = result.results[0].geometry.location;
      const point = new google.maps.LatLng(lat, lng);
      gMap.setCenter(point);
      gMap.setZoom(13);

      if (searchFromRecent) {
        const circle = new google.maps.Circle({
          map: gMap,
          center: point,
          radius: 5000,
        });

        gMapCircle = circle;
        removeMarkersOnMap();
        clearOutPlaceSection();
        stopMapUse();
        removeCircle();
        getAnswerFromChatGPT(
          `Can you give me a list of good pubs in ${place} and a description, separated by colons?`
        )
          .then((answer) => {
            // Perform additional operations with the answer
            pubObj = parseText(answer);
            continueMapUse();
            pubObj.pubNames.forEach(function (pubName, index) {
              const request = {
                query: `${pubName} in ${place}`,
                fields: [
                  "name",
                  "geometry",
                  "formatted_address",
                  "photos",
                  "icon",
                ],
                locationBias: circle,
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

recentSearch.addEventListener(`click`, function (e) {
  const place = e.target.textContent;

  findLocationByAddress(place, true);
});

function removeCircle() {
  if (!gMapCircle) return;
  console.log(gMapCircle);
  gMapCircle.setMap(null);
  gMapCircle = null;
}

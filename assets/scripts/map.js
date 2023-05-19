// Initialize the map.
let geocoder;
let infowindow;
let gMap;

//Lat and longitude when clicked
let clickedLat, clickedLng;

// let map_icon_green,
//   map_icon_blue,
//   map_icon_red,
//   map_icon_shadow,
//   map_icon_yellow,
//   map_crosshair;

// async function initMarkers() {
//   map_icon_green = await new google.maps.MarkerImage(
//     "http://mysite.com/green_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_blue = await new google.maps.MarkerImage(
//     "http://mysite.com/blue_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_yellow = await new google.maps.MarkerImage(
//     "http://mysite.com/yellow_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_red = await new google.maps.MarkerImage(
//     "http://mysite.com/red_pointer.png",
//     new google.maps.Size(12, 20),
//     new google.maps.Point(0, 0)
//   );

//   map_icon_shadow = await new google.maps.MarkerImage(
//     "http://mysite.com/shadow.png",
//     new google.maps.Size(28, 20),
//     new google.maps.Point(-6, 0)
//   );

//   map_crosshair = await new google.maps.MarkerImage(
//     "http://mysite.com/cross-hair.gif",
//     new google.maps.Size(17, 17),
//     new google.maps.Point(0, 0)
//   );
// }

async function initMap() {
  // The map, centered at Uluru
  new google.maps.places.Autocomplete(document.getElementById(`location`));

  gMap = await new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: {
      lat: 40.72,
      lng: -73.96,
    },
  });

  gecoder = new google.maps.Geocoder();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        gMap.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // Configure the click listener.

  //Gets the lat and Long from a click event
  gMap.addListener("click", (mapsMouseEvent) => {
    const latlon = mapsMouseEvent.latLng.toJSON();
    clickedLat = latlon.lat;
    clickedLng = latlon.lng;
    let locationName;
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
                }
              });
            }
          }
        }
      }
    );

    ////

    const point = new google.maps.LatLng(clickedLat, clickedLng);

    marker = map_create_marker(point, locationName, false);

    let pubObj;

    getAnswerFromChatGPT(
      `Can you give me a list of good pubs at latitude ${clickedLat} and longitude ${clickedLng} and a description of those pubs, separated by colons?`
    )
      .then((answer) => {
        // Perform additional operations with the answer
        pubObj = parseText(answer);

        pubObj.pubNames.forEach(function (pubName) {
          const request = {
            query: pubName,
            fields: ["name", "geometry", "formatted_address", "photos"],
          };

          findPlace(request, pubName);
        });
        //PREFORM PAGE TRANSFORM
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error appropriately
      });
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  console.log(`Hasn't got access to users location`);
}

function lookupLocation(location) {
  var requestOptions = {
    method: "GET",
    mode: "no-cors",
  };
  fetch(
    `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${location}&types=establishment&location=37.76999%2C-122.44696&radius=500&key=A${key}`
  )
    .then((response) => response.json())
    .then((result) => getPlaceId(result));
}

function findMultipleLocations() {
  locations = [`5,2`, `7,3`];
  locations.forEach(function (latlng) {
    findLocationByLatLng(latlng);
  });
}

//FINDS LOCATION BY ADDRESS NAME
function findLocationByAddress(pubName, place) {
  console.log(pubName);
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${pubName},${place}&key=${key}`
  )
    .then((response) => response.json())
    .then(function (result) {
      if (!(result.status === "OK")) return;
      map_create_marker(result.results[0].geometry.location, pubName);
      gMap.setCenter(result.results[0].geometry.location);
      gMap.setZoom(11);
    });
}

//FINDS LOCATION BY LATITUDE AND LONGITUDE
function findLocationByLatLng(latlng) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${key}`
  )
    .then((response) => response.json())
    .then(function (result) {
      if (!(result.status === "OK")) return;
      gMap = new google.maps.Map(document.getElementById("map"));
      console.log(result.results[0].geometry.location);
      const markerOptions = new google.maps.Marker({
        clickable: true,
        flat: true,
        map: gMap,
        position: result.results[0].geometry.location,
        title: "You are here",
        visible: true,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
      gMap.setCenter(result.results[0].geometry.location);
      gMap.setZoom(13);
    });
}

//EVENT HANDLER

const searchForm = document.querySelector(`#search-section`);
searchForm.addEventListener(`submit`, function (e) {
  e.preventDefault();
  console.log(`hello`);
  const inputSection = document.querySelector(`input`);
  const text = inputSection.value;
  if (!text) return;
  // findMultipleLocations();
  findLocationByAddress(text);
});

function map_create_marker(point, html, isPub = true) {
  let marker;
  if (!isPub) {
    marker = new google.maps.Marker({
      position: point,
      map: gMap,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
      },
    });
  } else {
    marker = new google.maps.Marker({
      position: point,
      map: gMap,
    });
  }

  if (html != "") {
    const infowindow = new google.maps.InfoWindow({
      content: html,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
  }
  return marker;
}

initMap();
window.initMap = initMap;
// initMarkers();

async function findPlace(request, pubName) {
  const service = new google.maps.places.PlacesService(gMap);

  service.findPlaceFromQuery(request, function (results, status) {
    console.log(results);

    const imgURL = results[0].photos[0].getUrl();
    const lat = results[0].geometry.location.lat();
    const lng = results[0].geometry.location.lng();
    const position = new google.maps.LatLng(lat, lng);
    map_create_marker(position, pubName, true);
    console.log(lat, lng);
    console.log(imgURL);
  });
}

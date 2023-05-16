// Initialize the map.
let geocoder;
let infowindow;
let map;

//Lat and longitude when clicked
let clickedLat, clickedLin;

async function initMap() {
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: {
      lat: 40.72,
      lng: -73.96,
    },
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
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
  map.addListener("click", (mapsMouseEvent) => {
    console.log(mapsMouseEvent.latLng.toJSON());
  });
}

window.initMap = initMap;

initMap();

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
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

window.initMap = initMap;

function findMultipleLocations() {
  locations = [`5,2`, `7,3`];
  locations.forEach(function (latlng) {
    findLocationByLatLng(latlng);
  });
}

//FINDS LOCATION BY ADDRESS NAME
function findLocationByAddress(place) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${key}`
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

const clickME = document.querySelector(`#searchButton`);
clickME.addEventListener(`click`, function () {
  console.log(`hello`);
  const inputSection = document.querySelector(`input`);
  const text = inputSection.value;
  if (!text) return;
  // findMultipleLocations();
  findLocationByAddress(text);
});

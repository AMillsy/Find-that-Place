// Initialize the map.
let geocoder;
let infowindow;
let map;

//Lat and longitude when clicked
let clickedLat, clickedLng;

var map_icon_green = new google.maps.MarkerImage(
  "http://mysite.com/green_pointer.png",
  new google.maps.Size(12, 20),
  new google.maps.Point(0, 0)
);

var map_icon_blue = new google.maps.MarkerImage(
  "http://mysite.com/blue_pointer.png",
  new google.maps.Size(12, 20),
  new google.maps.Point(0, 0)
);

var map_icon_yellow = new google.maps.MarkerImage(
  "http://mysite.com/yellow_pointer.png",
  new google.maps.Size(12, 20),
  new google.maps.Point(0, 0)
);

var map_icon_red = new google.maps.MarkerImage(
  "http://mysite.com/red_pointer.png",
  new google.maps.Size(12, 20),
  new google.maps.Point(0, 0)
);

var map_icon_shadow = new google.maps.MarkerImage(
  "http://mysite.com/shadow.png",
  new google.maps.Size(28, 20),
  new google.maps.Point(-6, 0)
);

var map_crosshair = new google.maps.MarkerImage(
  "http://mysite.com/cross-hair.gif",
  new google.maps.Size(17, 17),
  new google.maps.Point(0, 0)
);

async function initMap() {
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
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
    const latlon = mapsMouseEvent.latLng.toJSON();
    clickedLat = latlon.lat;
    clickedLng = latlon.lng;

    console.log(clickedLat, clickedLng);

    var point = new google.maps.LatLng(clickedLat, clickedLng);

    marker = map_create_marker(point, `Hello`, map_icon_blue);
  });
}

window.initMap = initMap;

initMap();

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

function map_create_marker(point, html, icon) {
  var marker = new google.maps.Marker({
    position: point,
    map: map,
    icon: icon,
    shadow: map_icon_shadow,
  });

  if (html != "") {
    var infowindow = new google.maps.InfoWindow({
      content: html,
    });
    google.maps.event.addListener(marker, "click", function () {
      infowindow.open(map, marker);
    });
  }
  return marker;
}

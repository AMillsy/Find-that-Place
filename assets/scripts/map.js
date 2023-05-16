// Initialize the map.
let geocoder;
let infowindow;
let map;
let gMap;
async function initMap() {
  // The location of Uluru
  const position = { lat: -25.344, lng: 131.031 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 4,
    center: position,
    mapId: "ChIJdd4hrwug2EcRmSrV3Vo6llI",
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "London",
  });
}

initMap();

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

function getPlaceId(result) {
  console.log(result);
  var placeId = result.predictions[0].place_id;
  geocodePlaceId(placeId);
}

function geocodePlaceId(placeId) {
  geocoder
    .geocode({
      placeId: placeId,
    })
    .then(({ results }) => {
      if (results[0]) {
        map.setZoom(11);
        map.setCenter(results[0].geometry.location);
        const marker = new google.maps.Marker({
          map,
          position: results[0].geometry.location,
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(map, marker);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}
window.initMap = initMap;

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

//// TEST INPUT ////
/*
const input = `1. Hyde Park: One of the largest parks in London, Hyde Park is a popular spot for visitors and locals alike. It features a lake, Speakers' Corner, The Serpentine, and many other attractions.
2. Regent's Park: This beautiful park is home to the London Zoo, an open-air theater, and a boating lake. It's also a great place to take a stroll or have a picnic.
3. Kensington Gardens: This park is situated adjacent to Hyde Park and is home to Kensington Palace, the Albert Memorial, and the Serpentine Gallery.
4. St James's Park: St James's Park is the oldest of London's Royal Parks, and it features a lake, gardens, and a variety of wildlife.
5. Greenwich Park: This park is home to the Royal Observatory, the National Maritime Museum, and the Queen's House. It's also a great spot for a picnic or a leisurely stroll.
6. Battersea Park: This large park is home to a lake, a children's zoo, an adventure playground, and a boating lake.
7. Victoria Park: This popular park is home to a lake, a cafe, and a variety of sports facilities.
8. Hampstead Heath: This large park is home to a variety of wildlife, a swimming pond, and a variety of walking trails.
9. Richmond Park: This park is home to a variety of wildlife, including deer and wild ponies. It's also a great spot for a picnic or a leisurely stroll.
10. Bushy Park: This park is home to a variety of wildlife, including deer, rabbits, and foxes. It's also a great spot for a picnic or a leisurely stroll.`;
*/
function parseText(text) {
  const textSections = text.split(`\n`);

  const takeFrontSection = [];
  textSections.forEach(function (section) {
    takeFrontSection.push(section.split(`:`)[0]);
  });

  const placesName = [];
  takeFrontSection.forEach(function (listitem) {
    placesName.push(listitem.split(`.`)[1].trimStart());
  });
  console.log(textSections);
  console.log(takeFrontSection);
  console.log(placesName);
}

const clickME = document.querySelector(`#searchButton`);
clickME.addEventListener(`click`, function () {
  console.log(`HELLO`);
  // findMultipleLocations();
  findLocationByAddress();
});

function findMultipleLocations() {
  locations = [`5,2`, `7,3`];
  locations.forEach(function (latlng) {
    findLocationByLatLng(latlng);
  });
}

function findLocationByAddress(place) {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=london&key=${key}`
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

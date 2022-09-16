//const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  projection: "globe", // display the map as a 3D globe
});

map.addControl(new mapboxgl.NavigationControl());

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div class="card text-center border-0" style="width: 10rem;">
      <p class="card-title mt-3"><strong>${campground.title}</strong></p>
      <p class="card-title"><small>${campground.location}</small></p>
      <div>`
    )
  )
  .addTo(map);

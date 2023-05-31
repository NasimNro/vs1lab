// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
  const mapManager = new MapManager("3VkrTyuWjAmV5eQbS0EsHC7jVrtsSoyg");
  const latitudeElement = document.getElementById("tagging_latitude");
  const longitudeElement = document.getElementById("tagging_longitude");
  const hiddenLatitudeElement = document.getElementById("discovery_latitude");
  const hiddenLongitudeElement = document.getElementById("discovery_longitude");
  const mapViewElement = document.getElementById("mapView");

  if (
    latitudeElement.value === "" ||
    longitudeElement.value === "" ||
    hiddenLatitudeElement.value === "" ||
    hiddenLongitudeElement.value === "" 
    
  ) {
    LocationHelper.findLocation(({ latitude, longitude }) => {
      latitudeElement.value = latitude;
      longitudeElement.value = longitude;
      hiddenLatitudeElement.value = latitude;
      hiddenLongitudeElement.value = longitude;
      
      const tags = JSON.parse(mapViewElement.dataset.tags);
      console.log(tags)
      const mapUrl = mapManager.getMapUrl(latitude, longitude, tags);
      mapViewElement.src = mapUrl;
    });
  }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  updateLocation();
});
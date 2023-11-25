// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
let searchTerm = "";
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
    hiddenLongitudeElement.value === "" ||
    mapViewElement.src.includes("images/mapview.jpg")

  ) {
    LocationHelper.findLocation(({ latitude, longitude }) => {
      latitudeElement.value = latitude;
      longitudeElement.value = longitude;
      hiddenLatitudeElement.value = latitude;
      hiddenLongitudeElement.value = longitude;
      
      const tags = JSON.parse(mapViewElement.dataset.tags);
      console.log(tags)
      const mapUrl = mapManager.getMapUrl(latitude, longitude, tags, 14);
      mapViewElement.src = mapUrl;
    });
  }
}


async function updatePageContent(tagsResponse = undefined) {
  console.log("updatePageContent", tagsResponse);
  const mapManager = new MapManager("3VkrTyuWjAmV5eQbS0EsHC7jVrtsSoyg");
  let data = tagsResponse;
  if (data === undefined) {
    const hiddenLatitude = document.getElementById("discovery_latitude")?.value;
    const hiddenLongitude = document.getElementById("discovery_longitude")?.value;

    const queryParameters = new URLSearchParams();
    if (searchTerm !== "") queryParameters.append("searchterm", searchTerm);
    if (hiddenLatitude) queryParameters.append("latitude", hiddenLatitude);
    if (hiddenLongitude) queryParameters.append("longitude", hiddenLongitude);
    const geotagsResponse = await fetch(`/api/geotags?${queryParameters}`);
    data = await geotagsResponse.json();
    
  }
  


  const mapViewElement = document.getElementById("mapView");
  const hiddenLatitude = document.getElementById("discovery_latitude").value;
  const hiddenLongitude = document.getElementById("discovery_longitude").value;

  const discoveryResultsElement = document.getElementById("discoveryResults");
  discoveryResultsElement.innerHTML = ""; // clear all li elements
  console.log("records" + data.records);
  console.log("haha" + data);
  data.records.forEach(({ name, latitude, longitude, hashtag }) => {
    const li = document.createElement("li");
    li.innerHTML = `${name} (${latitude}, ${longitude}) ${hashtag}`;
    discoveryResultsElement.appendChild(li);
  });


  const mapUrl = mapManager.getMapUrl(
    hiddenLatitude,
    hiddenLongitude,
    data.records
  );
  mapViewElement.src = mapUrl;
}


// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  updateLocation();
  
  
  document
  .getElementById("tag-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const requestData = {};
    if (form.checkValidity()) {
      requestData["tagging_latitude"] = form.tagging_latitude.value;
      requestData["tagging_longitude"] = form.tagging_longitude.value;
      requestData["tagging_name"] = form.tagging_name.value;
      requestData["tagging_hashtag"] = form.tagging_hashtag.value;

      searchTerm = searchTerm;

      const response = await fetch("/api/geotags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (response.ok) {
        //const geotag = await response.json();
        await updatePageContent();
        document.getElementById("tagging_name").value = "";
        document.getElementById("tagging_hashtag").value = "";
        return true;
      } else {
        console.error("Error while adding geotag");
      }
    }
    return false;
  });
document
  .getElementById("discoveryFilterForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
      const queryParameters = new URLSearchParams();
      const hiddenLatitude = form.discovery_latitude.value;
      const hiddenLongitude = form.discovery_longitude.value;
      const searchterm = form.searchterm.value;
      searchTerm = searchterm;

      if (hiddenLatitude !== "")
        queryParameters.append("discovery_latitude", hiddenLatitude);
      if (hiddenLongitude !== "")
        queryParameters.append("discovery_longitude", hiddenLongitude);
      if (searchterm !== "") queryParameters.append("searchterm", searchterm);
      const response = await fetch(`/api/geotags?${queryParameters}`);
      if (response.ok) {
        const data = await response.json();
        await updatePageContent(data);
      } else {
        console.error("Error while adding geotag");
      }

      return;
    }

    return false;
  });

});
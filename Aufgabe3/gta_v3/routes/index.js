// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require("express");
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require("../models/geotag");

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagExamples = require("../models/geotag-examples");
const GeoTagStore = require("../models/geotag-store");
const store = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, latitude, longitude, hashtag]) =>
  store.addGeoTag(new GeoTag(latitude, longitude, name, hashtag))
);
const DEFAULT_RADIUS = 10000;

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get("/", (req, res) => {
  res.render("index", { taglist: [], latitude: "", longitude: "" });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

router.post("/tagging", (req, res) => {
  const { tagging_name, tagging_hashtag, tagging_latitude, tagging_longitude } = req.body;
  const NewGeoTag = new GeoTag(tagging_latitude, tagging_longitude,tagging_name, tagging_hashtag);
  store.addGeoTag(NewGeoTag);
  const tags = store.getNearbyGeoTags(tagging_latitude, tagging_longitude, DEFAULT_RADIUS);
  
  res.render("index", {
    taglist: tags,
    latitude: tagging_latitude,
    longitude: tagging_longitude,
  });
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

router.post("/discovery", (req, res) => {
  const { discovery_search, discovery_latitude, discovery_longitude } = req.body;
  let tags = [];
  if (discovery_search) {
    tags = store.searchNearbyGeoTags(
      discovery_latitude,
      discovery_longitude,
      DEFAULT_RADIUS,
      discovery_search
    );
  } else {
    tags = store.getNearbyGeoTags(
      discovery_latitude,
      discovery_longitude,
      DEFAULT_RADIUS
    );
  }
  return res.render("index", {
    taglist: tags,
    latitude: discovery_latitude,
    longitude: discovery_longitude,
  });
});

module.exports = router;
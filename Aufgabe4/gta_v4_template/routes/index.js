// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagExamples = require("../models/geotag-examples");                
const GeoTagStore = require("../models/geotag-store");
const store = new GeoTagStore();
GeoTagExamples.tagList.forEach(([name, latitude, longitude, hashtag]) =>
  store.addGeoTag(new GeoTag(latitude, longitude, name, hashtag))
);
const DEFAULT_RADIUS = 10;
// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

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
  
  if(discovery_search){
    tags = store.searchNearbyGeoTags(
      discovery_latitude,
      discovery_longitude,
      DEFAULT_RADIUS,
      discovery_search
    );
  } else {
    tags = store.getNearbyGeoTags(discovery_latitude, discovery_longitude, DEFAULT_RADIUS);
  }

  return res.render("index", {
    taglist: tags,
    latitude: discovery_latitude,
    longitude: discovery_longitude,
  });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get("/api/geotags", (req, res) => {
  const searchterm = req.query.searchterm;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  const page = req.query.page ?? 1;

  let tags = [];
  if (searchterm && latitude && longitude) {
    if (latitude && longitude) {
      tags = store.searchNearbyGeoTags(
        latitude,
        longitude,
        DEFAULT_RADIUS,
        searchterm
      );
    } else {
      tags = store.searchGeoTags(searchterm);
    }
  } else {
    tags = store.getGeoTags();
  }


  return res.status(200).json(tags);
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post("/api/geotags", (req, res) => {
  const { tagging_name, tagging_hashtag, tagging_latitude, tagging_longitude } = req.body;
  const Tag = new GeoTag(tagging_latitude, tagging_longitude,tagging_name, tagging_hashtag);
  store.addGeoTag(Tag);
  return res.status(201).json(Tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.get("/api/geotags/:id", (req, res) => {
  const id = req.params.id;
  const tag = store.getGeoTagById(id);
  return res.status(200).json(tag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put("/api/geotags/:id", (req, res) => {
  const id = req.params.id;
  const geoTag = req.body;
  const updatedTag = store.updateGeoTag(id, geoTag);
  return res.status(200).json(updatedTag);
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...

router.delete("/api/geotags/:id", (req, res) => {
  const id = req.params.id;
  const deletedTag = store.removeGeoTagById(id);
  return res.status(200).json(deletedTag);
});

module.exports = router;

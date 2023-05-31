// File origin: VS1LAB A3
/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {
    #geotags = [];
  
    addGeoTag(geotag) {
      this.#geotags.push(geotag);
    }
  
    getGeoTags() {
      return this.#geotags;
    }
  
    removeGeoTag(name) {
      this.#geotags = this.#geotags.filter((geotag) => geotag.name !== name);
    }
  
    /*
      Diese Methode nimmt die Breitengrad-, Längengrad- und Radiuswerte als Eingabeparameter entgegen 
      und gibt ein Array von Geotags zurück, die innerhalb des angegebenen Radius von der angegebenen Position
      entfernt sind. Es verwendet die euklidische Norm / Satz des Pythagoras, um die Entfernung zwischen jedem Geotag 
      und der angegebenen Position zu berechnen und gibt nur die Geotags zurück, deren Entfernung kleiner 
      oder gleich dem angegebenen Radius ist.
    */
    getNearbyGeoTags(latitude, longitude, radius) {
      return this.#geotags.filter((geotag) => {
        const distance = Math.sqrt(
          Math.pow(latitude - geotag.latitude, 2) +
            Math.pow(longitude - geotag.longitude, 2)
        );
        return distance <= radius;
      });
    }
  
    /*
    Diese Methode nimmt die Breitengrad-, Längengrad-, Radius- und Suchbegriffwerte als Eingabeparameter 
    entgegen und gibt ein Array von Geotags zurück, die dem Suchbegriff entsprechen und innerhalb des 
    angegebenen Radius von der angegebenen Position entfernt sind. Zunächst ruft es die getNearbyGeoTags-Methode auf, 
    um alle Geotags innerhalb des angegebenen Radius abzurufen, und filtert dann die Ergebnisse auf der Grundlage, 
    ob der Name oder das Hashtag des Geotags den Suchbegriff enthält.
    */
    searchNearbyGeoTags(latitude, longitude, radius, searchterm) {
      return this.getNearbyGeoTags(latitude, longitude, radius).filter(
        (geotag) => {
          return (
            geotag.name.includes(searchterm) ||
            geotag.hashtag.includes(searchterm)
          );
        }
      );
    }
  }
  
  module.exports = InMemoryGeoTagStore;
  
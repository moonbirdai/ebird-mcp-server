/**
 * eBird Client
 * A simple Promise-based API client for eBird API
 */

import fetch from 'node-fetch';

export class EBirdClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.ebird.org/v2';
  }

  /**
   * Make a request to the eBird API
   */
  async makeRequest(endpoint, params = {}, expectJson = true) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-eBirdApiToken': this.apiKey,
          'Accept': expectJson ? 'application/json' : 'text/plain'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
      }
      
      // Return parsed JSON or raw text based on expectJson flag
      return expectJson ? await response.json() : await response.text();
    } catch (error) {
      console.error(`Error making request to ${url}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get recent observations in a region
   * @param {string} regionCode - Region code (e.g., US, US-NY, L123456)
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getRecentObservations(regionCode, options = {}) {
    const { back = 14, maxResults = 100, includeProvisional = true, hotspot = false, detail = 'simple' } = options;
    
    const params = {
      back,
      maxResults,
      includeProvisional: includeProvisional ? 'true' : 'false',
      hotspot: hotspot ? 'true' : 'false'
    };
    
    const endpoint = detail === 'full' 
      ? `/data/obs/${regionCode}/recent/detailed` 
      : `/data/obs/${regionCode}/recent`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get recent observations of a species in a region
   * @param {string} regionCode - Region code
   * @param {string} speciesCode - Species code
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getRecentObservationsForSpecies(regionCode, speciesCode, options = {}) {
    const { back = 14, maxResults = 100, includeProvisional = true, hotspot = false } = options;
    
    const params = {
      back,
      maxResults,
      includeProvisional: includeProvisional ? 'true' : 'false',
      hotspot: hotspot ? 'true' : 'false'
    };
    
    const endpoint = `/data/obs/${regionCode}/recent/${speciesCode}`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get notable observations in a region
   * @param {string} regionCode - Region code
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getNotableObservations(regionCode, options = {}) {
    const { back = 14, maxResults = 100, detail = 'simple' } = options;
    
    const params = {
      back,
      maxResults
    };
    
    const endpoint = detail === 'full'
      ? `/data/obs/${regionCode}/recent/notable/detailed`
      : `/data/obs/${regionCode}/recent/notable`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get nearby observations
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getNearbyObservations(lat, lng, options = {}) {
    const { back = 14, dist = 25, maxResults = 100, includeProvisional = true, hotspot = false, detail = 'simple' } = options;
    
    const params = {
      lat,
      lng,
      back,
      dist,
      maxResults,
      includeProvisional: includeProvisional ? 'true' : 'false',
      hotspot: hotspot ? 'true' : 'false'
    };
    
    // Don't use /detailed endpoint as it's causing 400 errors
    const endpoint = `/data/obs/geo/recent`;
    
    try {
      return await this.makeRequest(endpoint, params);
    } catch (error) {
      console.error(`Error fetching nearby observations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get nearby notable observations
   * @param {number} lat - Latitude 
   * @param {number} lng - Longitude
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getNearbyNotableObservations(lat, lng, options = {}) {
    const { back = 14, dist = 25, maxResults = 100, detail = 'simple' } = options;
    
    const params = {
      lat,
      lng,
      back,
      dist,
      maxResults
    };
    
    // Don't use /detailed endpoint as it's causing 400 errors
    const endpoint = `/data/obs/geo/recent/notable`;
    
    try {
      return await this.makeRequest(endpoint, params);
    } catch (error) {
      console.error(`Error fetching nearby notable observations: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get nearby observations of a species
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} speciesCode - Species code
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of observation data
   */
  async getNearbyObservationsForSpecies(lat, lng, speciesCode, options = {}) {
    const { back = 14, dist = 25, maxResults = 100, includeProvisional = true } = options;
    
    const params = {
      lat,
      lng,
      back,
      dist,
      maxResults,
      includeProvisional: includeProvisional ? 'true' : 'false'
    };
    
    const endpoint = `/data/obs/geo/recent/${speciesCode}`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get hotspots in a region
   * @param {string} regionCode - Region code
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of hotspot data
   */
  async getHotspots(regionCode, options = {}) {
    const { back = 14, includeProvisional = true } = options;
    
    const params = {
      back,
      includeProvisional: includeProvisional ? 'true' : 'false'
    };
    
    const endpoint = `/ref/hotspot/${regionCode}`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get nearby hotspots
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of hotspot data
   */
  async getNearbyHotspots(lat, lng, options = {}) {
    const { dist = 25, back = 14, includeProvisional = true, fmt = 'json' } = options;
    
    const params = {
      lat,
      lng,
      dist,
      back,
      includeProvisional: includeProvisional ? 'true' : 'false',
      fmt // Explicitly request JSON format
    };
    
    const endpoint = `/ref/hotspot/geo`;
    
    try {
      // First try with JSON format
      return await this.makeRequest(endpoint, params);
    } catch (error) {
      // If JSON parsing fails, try getting raw text format and parse it manually
      console.log("Falling back to text format for hotspots");
      
      // Remove the fmt parameter to get default format
      delete params.fmt;
      
      const textResponse = await this.makeRequest(endpoint, params, false);
      
      // Parse the text response - expected format is comma-separated location IDs
      // We'll convert to a standardized format similar to other responses
      if (textResponse) {
        const locationIds = textResponse.split(',').map(id => id.trim()).filter(id => id);
        
        // For each location ID, we need to get detailed info - but to avoid too many
        // requests, we'll return a simplified format with just the location IDs
        return locationIds.map(locId => ({
          locId: locId,
          locName: `Hotspot ${locId}`,
          lat: lat, // We don't have exact coordinates, so we use the search coords
          lng: lng,
          numSpecies: null,
          isHotspot: true
        }));
      }
      
      return [];
    }
  }

  /**
   * Get taxonomy information
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Array of taxonomy data
   */
  async getTaxonomy(options = {}) {
    const { locale = 'en', cat = 'species', fmt = 'json' } = options;
    
    const params = {
      locale,
      cat,
      fmt
    };
    
    const endpoint = `/ref/taxonomy/ebird`;
    
    return this.makeRequest(endpoint, params);
  }

  /**
   * Get taxonomy forms
   * @param {string} speciesCode - Species code
   * @returns {Promise<Array>} - Array of taxonomy form data
   */
  async getTaxonomyForms(speciesCode) {
    const endpoint = `/ref/taxonomy/forms/${speciesCode}`;
    return this.makeRequest(endpoint);
  }
}

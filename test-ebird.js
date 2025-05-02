#!/usr/bin/env node

/**
 * Test script for eBird MCP server
 */

import { EBirdClient } from './ebird-client.js';

// Get API key from environment variable
const apiKey = process.env.EBIRD_API_KEY;

if (!apiKey) {
  console.error('Error: EBIRD_API_KEY environment variable is not set');
  process.exit(1);
}

const ebird = new EBirdClient(apiKey);

// Test functions
async function runTests() {
  try {
    console.log('Testing eBird client...\n');
    
    // Test recent observations in New York
    console.log('Testing getRecentObservations(US-NY)...');
    const observations = await ebird.getRecentObservations('US-NY', { maxResults: 5 });
    console.log(`Got ${observations.length} observations:`);
    console.log(JSON.stringify(observations, null, 2));
    console.log('\n');
    
    // Test nearby observations (Central Park, New York)
    console.log('Testing getNearbyObservations(40.7829, -73.9654)...');
    const nearbyObservations = await ebird.getNearbyObservations(40.7829, -73.9654, { maxResults: 5 });
    console.log(`Got ${nearbyObservations.length} nearby observations:`);
    console.log(JSON.stringify(nearbyObservations, null, 2));
    console.log('\n');
    
    // Test nearby hotspots (Central Park, New York)
    console.log('Testing getNearbyHotspots(40.7829, -73.9654)...');
    const hotspots = await ebird.getNearbyHotspots(40.7829, -73.9654, { maxResults: 5 });
    console.log(`Got ${hotspots.length} nearby hotspots:`);
    console.log(JSON.stringify(hotspots, null, 2));
    console.log('\n');
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

runTests();

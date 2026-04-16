#!/usr/bin/env node

/**
 * eBird MCP Server
 * A Model Context Protocol server for eBird API integration
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from "@modelcontextprotocol/sdk/types.js";
import { Command } from 'commander';
import { EBirdClient } from './ebird-client.js';

// Parse command line arguments
const program = new Command();
program
  .name('ebird-mcp-server')
  .description('MCP server for eBird API integration')
  .version('1.0.0')
  .requiredOption('--api-key <string>', 'Your eBird API key')
  .option('--debug', 'Enable debug mode for verbose logging', false)
  .parse();

const options = program.opts();
const ebirdApiKey = options.apiKey;
const debug = options.debug;

// Debug logging function
function log(...args) {
  if (debug) {
    console.error(`[${new Date().toISOString()}]`, ...args);
  }
}

log(`Initializing eBird MCP server with API key: ${ebirdApiKey.substring(0, 3)}...`);

// Tool definitions
const tools = [
  {
    name: "ebird_get_recent_observations",
    description: "Get recent bird observations in a region or location",
    inputSchema: {
      type: "object",
      properties: {
        regionCode: { 
          type: "string", 
          description: "Region code (e.g., US, US-NY, L123456)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        },
        hotspot: { 
          type: "boolean", 
          description: "Only include observations from hotspots (default: false)"
        },
        detail: { 
          type: "string", 
          description: "Detail level of results is always 'simple' for now due to API limitations"
        }
      },
      required: ["regionCode"]
    }
  },
  {
    name: "ebird_get_recent_observations_for_species",
    description: "Get recent observations of a specific bird species in a region",
    inputSchema: {
      type: "object",
      properties: {
        regionCode: { 
          type: "string", 
          description: "Region code (e.g., US, US-NY, L123456)"
        },
        speciesCode: { 
          type: "string", 
          description: "eBird species code (e.g., amecro for American Crow)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        },
        hotspot: { 
          type: "boolean", 
          description: "Only include observations from hotspots (default: false)"
        }
      },
      required: ["regionCode", "speciesCode"]
    }
  },
  {
    name: "ebird_get_notable_observations",
    description: "Get notable bird observations in a region",
    inputSchema: {
      type: "object",
      properties: {
        regionCode: { 
          type: "string", 
          description: "Region code (e.g., US, US-NY, L123456)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        detail: { 
          type: "string", 
          description: "Detail level of results is always 'simple' for now due to API limitations"
        }
      },
      required: ["regionCode"]
    }
  },
  {
    name: "ebird_get_nearby_observations",
    description: "Get recent bird observations near a location",
    inputSchema: {
      type: "object",
      properties: {
        lat: { 
          type: "number", 
          description: "Latitude coordinate"
        },
        lng: { 
          type: "number", 
          description: "Longitude coordinate"
        },
        dist: { 
          type: "number", 
          description: "Distance in kilometers from lat/lng point (default: 25)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        },
        hotspot: { 
          type: "boolean", 
          description: "Only include observations from hotspots (default: false)"
        },
        detail: { 
          type: "string", 
          description: "Detail level of results is always 'simple' for now due to API limitations"
        }
      },
      required: ["lat", "lng"]
    }
  },
  {
    name: "ebird_get_nearby_notable_observations",
    description: "Get notable bird observations near a location",
    inputSchema: {
      type: "object",
      properties: {
        lat: { 
          type: "number", 
          description: "Latitude coordinate"
        },
        lng: { 
          type: "number", 
          description: "Longitude coordinate"
        },
        dist: { 
          type: "number", 
          description: "Distance in kilometers from lat/lng point (default: 25)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        detail: { 
          type: "string", 
          description: "Detail level of results is always 'simple' for now due to API limitations"
        }
      },
      required: ["lat", "lng"]
    }
  },
  {
    name: "ebird_get_nearby_observations_for_species",
    description: "Get recent observations of a specific bird species near a location",
    inputSchema: {
      type: "object",
      properties: {
        lat: { 
          type: "number", 
          description: "Latitude coordinate"
        },
        lng: { 
          type: "number", 
          description: "Longitude coordinate"
        },
        speciesCode: { 
          type: "string", 
          description: "eBird species code (e.g., amecro for American Crow)"
        },
        dist: { 
          type: "number", 
          description: "Distance in kilometers from lat/lng point (default: 25)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for observations (default: 14)"
        },
        maxResults: { 
          type: "number", 
          description: "Maximum number of results to return (default: 100)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        }
      },
      required: ["lat", "lng", "speciesCode"]
    }
  },
  {
    name: "ebird_get_hotspots",
    description: "Get birding hotspots in a region",
    inputSchema: {
      type: "object",
      properties: {
        regionCode: { 
          type: "string", 
          description: "Region code (e.g., US, US-NY)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for hotspot activity (default: 14)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        }
      },
      required: ["regionCode"]
    }
  },
  {
    name: "ebird_get_nearby_hotspots",
    description: "Get birding hotspots near a location",
    inputSchema: {
      type: "object",
      properties: {
        lat: { 
          type: "number", 
          description: "Latitude coordinate"
        },
        lng: { 
          type: "number", 
          description: "Longitude coordinate"
        },
        dist: { 
          type: "number", 
          description: "Distance in kilometers from lat/lng point (default: 25)"
        },
        back: { 
          type: "number", 
          description: "Number of days back to look for hotspot activity (default: 14)"
        },
        includeProvisional: { 
          type: "boolean", 
          description: "Include provisional observations (default: true)"
        }
      },
      required: ["lat", "lng"]
    }
  },
  {
    name: "ebird_get_taxonomy",
    description: "Get eBird taxonomy information",
    inputSchema: {
      type: "object",
      properties: {
        locale: { 
          type: "string", 
          description: "Language for common names (default: 'en')"
        },
        cat: { 
          type: "string", 
          description: "Taxonomic category to filter by (default: 'species')"
        },
        fmt: { 
          type: "string", 
          description: "Response format (default: 'json')"
        }
      }
    }
  },
  {
    name: "ebird_get_taxonomy_forms",
    description: "Get eBird taxonomy forms for a specific species",
    inputSchema: {
      type: "object",
      properties: {
        speciesCode: { 
          type: "string", 
          description: "eBird species code"
        }
      },
      required: ["speciesCode"]
    }
  }
];

// Create MCP server
const server = new Server(
  {
    name: "ebird-api",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize eBird client
const ebird = new EBirdClient(ebirdApiKey);

// Register tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('Received list_tools request');
  return { tools };
});

// Helper function to format observations
function formatObservations(observations) {
  if (!observations || observations.length === 0) {
    return "No observations found.";
  }

  return observations.map(obs => {
    const howMany = obs.howMany ? `Count: ${obs.howMany}` : 'Present';
    const date = new Date(obs.obsDt).toLocaleDateString();
    const time = obs.obsTime ? new Date(obs.obsTime).toLocaleTimeString() : '';
    const dateTime = time ? `${date} ${time}` : date;
    
    return `Species: ${obs.comName} (${obs.sciName})
Location: ${obs.locName}
${howMany}
Date: ${dateTime}
Coordinates: ${obs.lat}, ${obs.lng}${obs.userDisplayName ? `\nObserver: ${obs.userDisplayName}` : ''}`;
  }).join('\n\n');
}

// Helper function to format hotspots
function formatHotspots(hotspots) {
  if (!hotspots || hotspots.length === 0) {
    return "No hotspots found.";
  }

  return hotspots.map(hotspot => {
    // Handle both full hotspot objects and simplified ones from text response
    const name = hotspot.locName || `Hotspot ${hotspot.locId}`;
    const coordinates = (hotspot.lat && hotspot.lng) ? `${hotspot.lat}, ${hotspot.lng}` : 'Not available';
    const species = hotspot.numSpecies ? hotspot.numSpecies : 'Unknown';
    
    return `Hotspot: ${name}
Location ID: ${hotspot.locId}
Coordinates: ${coordinates}
Number of Species: ${species}`;
  }).join('\n\n');
}

// Helper function to format taxonomy data
function formatTaxonomy(taxonomy, limit = 20) {
  if (!taxonomy || taxonomy.length === 0) {
    return "No taxonomy data found.";
  }

  const limitedData = taxonomy.slice(0, limit);
  const output = limitedData.map(entry => {
    return `Common Name: ${entry.comName}
Scientific Name: ${entry.sciName}
Species Code: ${entry.speciesCode}
Order: ${entry.order}
Family: ${entry.familyComName} (${entry.familySciName})`;
  }).join('\n\n');

  if (taxonomy.length > limit) {
    return `${output}\n\n[Showing ${limit} of ${taxonomy.length} entries]`;
  }

  return output;
}

// Register tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
  const { name, arguments: args } = request.params;
  
  log(`Received call_tool request for: ${name}`);
  
  // Remove any detail parameter set to 'full' as it's not supported
  if (args && args.detail === 'full') {
    args.detail = 'simple';
        log('Changed detail parameter from full to simple');
      }
      
      let result;
      
      switch (name) {
      case "ebird_get_recent_observations": {
        if (!args.regionCode) {
          throw new Error("Missing required parameter: regionCode");
        }
        
        log(`Getting recent observations for region: ${args.regionCode}`);
        
        const observations = await ebird.getRecentObservations(args.regionCode, {
          back: args.back,
          maxResults: args.maxResults,
          includeProvisional: args.includeProvisional,
          hotspot: args.hotspot,
          detail: args.detail
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_recent_observations_for_species": {
        if (!args.regionCode || !args.speciesCode) {
          throw new Error("Missing required parameters: regionCode and speciesCode");
        }
        
        log(`Getting recent observations for species: ${args.speciesCode} in region: ${args.regionCode}`);
        
        const observations = await ebird.getRecentObservationsForSpecies(args.regionCode, args.speciesCode, {
          back: args.back,
          maxResults: args.maxResults,
          includeProvisional: args.includeProvisional,
          hotspot: args.hotspot
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_notable_observations": {
        if (!args.regionCode) {
          throw new Error("Missing required parameter: regionCode");
        }
        
        log(`Getting notable observations for region: ${args.regionCode}`);
        
        const observations = await ebird.getNotableObservations(args.regionCode, {
          back: args.back,
          maxResults: args.maxResults,
          detail: args.detail
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_nearby_observations": {
        if (args.lat === undefined || args.lng === undefined) {
          throw new Error("Missing required parameters: lat and lng");
        }
        
        log(`Getting nearby observations at coordinates: ${args.lat}, ${args.lng}`);
        
        const observations = await ebird.getNearbyObservations(args.lat, args.lng, {
          dist: args.dist,
          back: args.back,
          maxResults: args.maxResults,
          includeProvisional: args.includeProvisional,
          hotspot: args.hotspot,
          detail: args.detail
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_nearby_notable_observations": {
        if (args.lat === undefined || args.lng === undefined) {
          throw new Error("Missing required parameters: lat and lng");
        }
        
        log(`Getting nearby notable observations at coordinates: ${args.lat}, ${args.lng}`);
        
        const observations = await ebird.getNearbyNotableObservations(args.lat, args.lng, {
          dist: args.dist,
          back: args.back,
          maxResults: args.maxResults,
          detail: args.detail
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_nearby_observations_for_species": {
        if (args.lat === undefined || args.lng === undefined || !args.speciesCode) {
          throw new Error("Missing required parameters: lat, lng, and speciesCode");
        }
        
        log(`Getting nearby observations for species: ${args.speciesCode} at coordinates: ${args.lat}, ${args.lng}`);
        
        const observations = await ebird.getNearbyObservationsForSpecies(args.lat, args.lng, args.speciesCode, {
          dist: args.dist,
          back: args.back,
          maxResults: args.maxResults,
          includeProvisional: args.includeProvisional
        });
        
        result = formatObservations(observations);
        break;
      }
      
      case "ebird_get_hotspots": {
        if (!args.regionCode) {
          throw new Error("Missing required parameter: regionCode");
        }
        
        log(`Getting hotspots for region: ${args.regionCode}`);
        
        const hotspots = await ebird.getHotspots(args.regionCode, {
          back: args.back,
          includeProvisional: args.includeProvisional
        });
        
        result = formatHotspots(hotspots);
        break;
      }
      
      case "ebird_get_nearby_hotspots": {
        if (args.lat === undefined || args.lng === undefined) {
          throw new Error("Missing required parameters: lat and lng");
        }
        
        log(`Getting nearby hotspots at coordinates: ${args.lat}, ${args.lng}`);
        
        const hotspots = await ebird.getNearbyHotspots(args.lat, args.lng, {
          dist: args.dist,
          back: args.back,
          includeProvisional: args.includeProvisional
        });
        
        result = formatHotspots(hotspots);
        break;
      }
      
      case "ebird_get_taxonomy": {
        log("Getting taxonomy data");
        
        const taxonomy = await ebird.getTaxonomy({
          locale: args.locale,
          cat: args.cat,
          fmt: args.fmt
        });
        
        result = formatTaxonomy(taxonomy);
        break;
      }
      
      case "ebird_get_taxonomy_forms": {
        if (!args.speciesCode) {
          throw new Error("Missing required parameter: speciesCode");
        }
        
        log(`Getting taxonomy forms for species: ${args.speciesCode}`);
        
        const forms = await ebird.getTaxonomyForms(args.speciesCode);
        result = JSON.stringify(forms, null, 2);
        break;
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    
    return {
      content: [{ type: "text", text: result }],
    };
  } catch (error) {
    log(`Error in call_tool: ${error.message}`);
    
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the server
async function runServer() {
  try {
    // Create transport for stdio
    log('Initializing stdio transport');
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    log('Starting MCP server...');
    await server.connect(transport);
    
    log('eBird MCP Server is running via stdio');
  } catch (error) {
    log(`Fatal error starting server: ${error.message}`);
    process.exit(1);
  }
}

// Handle errors and termination
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
  log(error.stack);
  process.exit(1);
});

// Run the server
runServer().catch((error) => {
  log(`Fatal error: ${error.message}`);
  log(error.stack);
  process.exit(1);
});

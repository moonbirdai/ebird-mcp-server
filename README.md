[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/moonbirdai-ebird-mcp-server-badge.png)](https://mseep.ai/app/moonbirdai-ebird-mcp-server)

# eBird MCP Server

A Model Context Protocol (MCP) server for integrating with the eBird API. This server allows AI assistants, like Claude, to access bird observation data, hotspots, and taxonomy information from eBird.

## Quick Setup for Claude Desktop

Add this configuration to your Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ebird-api": {
      "command": "npx",
      "args": [
        "ebird-mcp-server",
        "--api-key",
        "YOUR_EBIRD_API_KEY"
      ]
    }
  }
}
```

Make sure to:
1. Replace `YOUR_EBIRD_API_KEY` with your actual eBird API key
2. Create the config file if it doesn't exist
3. Install the package globally with `npm install -g ebird-mcp-server` if you haven't already
4. Restart Claude Desktop after saving the changes

> **Note**: You can get an eBird API key from [eBird API Key Request](https://ebird.org/api/keygen)

## Features

The eBird MCP server provides access to the following eBird data:

- Recent bird observations in a region
- Recent observations of specific bird species
- Notable bird observations in a region
- Observations near a location
- Notable observations near a location
- Birding hotspots in a region
- Hotspots near a location
- eBird taxonomy information

## Prerequisites

- Node.js (v14 or later)
- An eBird API key (get one from [eBird API Key Request](https://ebird.org/api/keygen))

## Installation

### For Claude Desktop

1. Clone this repository or download the files
2. Run the Claude Desktop setup script:

```bash
chmod +x claude_setup.sh
./claude_setup.sh YOUR_EBIRD_API_KEY
```

3. Restart Claude Desktop

### For Other MCP Clients

1. Clone this repository or download the files
2. Run the installation script:

```bash
chmod +x install.sh
./install.sh YOUR_EBIRD_API_KEY
```

3. The server is now installed and can be run with:

```bash
./run-ebird-mcp-server.sh
```

### Manual Installation

1. Clone this repository or download the files
2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
node index.js --api-key YOUR_EBIRD_API_KEY
```

## Available Tools

### ebird_get_recent_observations

Get recent bird observations in a region or location.

**Parameters:**
- `regionCode` (required): Region code (e.g., US, US-NY, L123456)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `includeProvisional`: Include provisional observations (default: true)
- `hotspot`: Only include observations from hotspots (default: false)
- `detail`: Detail level of results ('simple' or 'full', default: 'simple')

### ebird_get_recent_observations_for_species

Get recent observations of a specific bird species in a region.

**Parameters:**
- `regionCode` (required): Region code (e.g., US, US-NY, L123456)
- `speciesCode` (required): eBird species code (e.g., amecro for American Crow)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `includeProvisional`: Include provisional observations (default: true)
- `hotspot`: Only include observations from hotspots (default: false)

### ebird_get_notable_observations

Get notable bird observations in a region.

**Parameters:**
- `regionCode` (required): Region code (e.g., US, US-NY, L123456)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `detail`: Detail level of results ('simple' or 'full', default: 'simple')

### ebird_get_nearby_observations

Get recent bird observations near a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `dist`: Distance in kilometers from lat/lng point (default: 25)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `includeProvisional`: Include provisional observations (default: true)
- `hotspot`: Only include observations from hotspots (default: false)
- `detail`: Detail level of results ('simple' or 'full', default: 'simple')

### ebird_get_nearby_notable_observations

Get notable bird observations near a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `dist`: Distance in kilometers from lat/lng point (default: 25)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `detail`: Detail level of results ('simple' or 'full', default: 'simple')

### ebird_get_nearby_observations_for_species

Get recent observations of a specific bird species near a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `speciesCode` (required): eBird species code (e.g., amecro for American Crow)
- `dist`: Distance in kilometers from lat/lng point (default: 25)
- `back`: Number of days back to look for observations (default: 14)
- `maxResults`: Maximum number of results to return (default: 100)
- `includeProvisional`: Include provisional observations (default: true)

### ebird_get_hotspots

Get birding hotspots in a region.

**Parameters:**
- `regionCode` (required): Region code (e.g., US, US-NY)
- `back`: Number of days back to look for hotspot activity (default: 14)
- `includeProvisional`: Include provisional observations (default: true)

### ebird_get_nearby_hotspots

Get birding hotspots near a location.

**Parameters:**
- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `dist`: Distance in kilometers from lat/lng point (default: 25)
- `back`: Number of days back to look for hotspot activity (default: 14)
- `includeProvisional`: Include provisional observations (default: true)

### ebird_get_taxonomy

Get eBird taxonomy information.

**Parameters:**
- `locale`: Language for common names (default: 'en')
- `cat`: Taxonomic category to filter by (default: 'species')
- `fmt`: Response format (default: 'json')

### ebird_get_taxonomy_forms

Get eBird taxonomy forms for a specific species.

**Parameters:**
- `speciesCode` (required): eBird species code

## Testing

To test the eBird MCP server, set your eBird API key as an environment variable and run the test script:

```bash
export EBIRD_API_KEY=your_api_key
node test-ebird.js
```

## Debug Mode

To enable debug mode and see detailed logging:

```bash
node index.js --api-key YOUR_EBIRD_API_KEY --debug
```

## License

MIT

## Acknowledgements

- [eBird](https://ebird.org/) for providing the API
- [Cornell Lab of Ornithology](https://www.birds.cornell.edu/) for their work on bird conservation
- [Model Context Protocol](https://modelcontextprotocol.io/) for the API integration framework
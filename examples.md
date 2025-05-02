# eBird MCP Server: Example Usage

This document provides examples of how to use the eBird MCP Server with Claude.

## Basic Queries

### Finding Recent Bird Observations

To find recent bird observations in a specific region, you can ask Claude something like:

> "What birds have been observed recently in New York state?"

Claude will use the `ebird_get_recent_observations` tool with `regionCode` set to "US-NY".

### Finding Nearby Observations

To find bird observations near a specific location, you can ask Claude something like:

> "What birds have been spotted near Central Park, New York City?"

Claude will use the `ebird_get_nearby_observations` tool with `lat` and `lng` coordinates for Central Park.

### Finding Notable or Rare Birds

To find notable or rare bird observations, you can ask Claude something like:

> "What rare birds have been reported in California recently?"

Claude will use the `ebird_get_notable_observations` tool with `regionCode` set to "US-CA".

### Finding Observations of a Specific Species

To find observations of a specific bird species, you can ask Claude something like:

> "Where have Bald Eagles been seen in Washington state this week?"

Claude will use the `ebird_get_recent_observations_for_species` tool with `regionCode` set to "US-WA" and `speciesCode` set to "baleag".

### Finding Birding Hotspots

To find birding hotspots in a region, you can ask Claude something like:

> "What are some good birding hotspots in Florida?"

Claude will use the `ebird_get_hotspots` tool with `regionCode` set to "US-FL".

## Advanced Queries

### Combining Multiple Queries

You can ask more complex questions that require multiple tool calls, such as:

> "Compare the recent bird sightings between Central Park and Golden Gate Park."

Claude will make multiple calls to get observations from both locations and present a comparison.

### Getting Detailed Taxonomy Information

For taxonomy information, you can ask Claude something like:

> "Tell me about the taxonomic classification of the Black-capped Chickadee."

Claude will use the `ebird_get_taxonomy` tool and filter the results for the Black-capped Chickadee.

### Finding Nearby Hotspots with Recent Activity

To find active birding locations near you, you can ask Claude something like:

> "What are the most active birding hotspots within 10 miles of Boston that have had bird sightings in the last week?"

Claude will use the `ebird_get_nearby_hotspots` tool with parameters for Boston's coordinates and recent activity.

## Tips for Effective Use

1. **Be specific about locations**: Provide city names, states, or even specific parks when asking about bird observations.

2. **Use common bird names**: When asking about specific species, use common English names rather than scientific names.

3. **Specify time periods if relevant**: For example, "in the last three days" or "this week" helps Claude set the appropriate `back` parameter.

4. **Ask about notable birds**: If you're interested in rare sightings, explicitly ask about "notable" or "rare" birds.

5. **Define search radius**: When looking for nearby observations, specifying a distance (e.g., "within 5 miles") helps Claude set the `dist` parameter appropriately.

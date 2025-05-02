#!/bin/bash

# Script to test the eBird MCP server
# This script requires an eBird API key to be set as an environment variable

# Check if EBIRD_API_KEY is set
if [ -z "$EBIRD_API_KEY" ]; then
  echo "Error: EBIRD_API_KEY environment variable is not set"
  echo "Please set it first with:"
  echo "export EBIRD_API_KEY=your_api_key"
  exit 1
fi

# Run the test script
node test-ebird.js

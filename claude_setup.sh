#!/bin/bash

# Script to set up eBird MCP server with Claude Desktop
# This script helps install the eBird MCP server in Claude Desktop's configuration

# Path to Claude Desktop config file
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Error: eBird API key is required"
  echo "Usage: $0 <ebird-api-key>"
  exit 1
fi

EBIRD_API_KEY="$1"

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if Claude Desktop config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  # Create initial config file
  mkdir -p "$(dirname "$CONFIG_FILE")"
  echo '{
  "mcpServers": {}
}' > "$CONFIG_FILE"
  echo "Created new Claude Desktop config file at $CONFIG_FILE"
fi

# Add the eBird MCP server to the config file
# This requires jq for JSON manipulation
if command -v jq >/dev/null 2>&1; then
  # Create temp file
  TMP_FILE=$(mktemp)
  
  # Update the config file
  jq --arg script_dir "$SCRIPT_DIR" --arg api_key "$EBIRD_API_KEY" '.mcpServers += {"ebird-api": {"command": "node", "args": [($script_dir + "/index.js"), "--api-key", $api_key]}}' "$CONFIG_FILE" > "$TMP_FILE"
  
  # Replace the original file
  mv "$TMP_FILE" "$CONFIG_FILE"
  
  echo "Added eBird MCP server to Claude Desktop config"
  echo "Please restart Claude Desktop for changes to take effect"
else
  echo "Error: jq is required for this script"
  echo "Please install jq (brew install jq) and try again"
  echo ""
  echo "Alternatively, manually add the following to $CONFIG_FILE:"
  echo '{
  "mcpServers": {
    "ebird-api": {
      "command": "node",
      "args": ["'"$SCRIPT_DIR"'/index.js", "--api-key", "'"$EBIRD_API_KEY"'"]
    }
  }
}'
  exit 1
fi

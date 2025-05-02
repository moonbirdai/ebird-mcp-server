#!/bin/bash

# Script to install the eBird MCP server globally

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Error: eBird API key is required"
  echo "Usage: $0 <ebird-api-key>"
  exit 1
fi

EBIRD_API_KEY="$1"

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Install dependencies
echo "Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

# Create a shell script to run the MCP server
echo "Creating wrapper script..."

# Path for the wrapper script
WRAPPER_PATH="$SCRIPT_DIR/run-ebird-mcp-server.sh"

# Create the wrapper script
cat > "$WRAPPER_PATH" << EOF
#!/bin/bash
node "$SCRIPT_DIR/index.js" --api-key "$EBIRD_API_KEY" \$@
EOF

# Make the wrapper script executable
chmod +x "$WRAPPER_PATH"

echo "eBird MCP server installed successfully!"
echo "You can now run the server with:"
echo "$WRAPPER_PATH"
echo ""
echo "To enable debug mode, add the --debug flag:"
echo "$WRAPPER_PATH --debug"

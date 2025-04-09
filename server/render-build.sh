#!/bin/bash
# Install dependencies
npm install --legacy-peer-deps

# Build the TypeScript code
npm run build

# Create the directory structure if needed
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist

# Only create the file if it doesn't exist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js ]; then
  echo 'export function isNodeLike() { return true; }' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js
  echo '{"name":"@apollo/utils.isnodelike","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/package.json
fi
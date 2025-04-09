#!/bin/bash
# Install dependencies
npm install --legacy-peer-deps

# Build the TypeScript code
npm run build

# Create Apollo utils directory structure
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js ]; then
  echo 'function isNodeLike() { return true; } module.exports = { isNodeLike };' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js
  echo '{"name":"@apollo/utils.isnodelike","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/package.json
fi

# Create saslprep directory structure
mkdir -p node_modules/@mongodb-js/saslprep/dist
if [ ! -f node_modules/@mongodb-js/saslprep/dist/node.js ]; then
  echo 'function saslprep(str) { return str; } module.exports = saslprep;' > node_modules/@mongodb-js/saslprep/dist/node.js
  echo '{"name":"@mongodb-js/saslprep","version":"1.1.0","main":"dist/node.js"}' > node_modules/@mongodb-js/saslprep/dist/package.json
fi

# Also handle the nested path if needed
mkdir -p node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist
if [ ! -f node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist/node.js ]; then
  echo 'function saslprep(str) { return str; } module.exports = saslprep;' > node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist/node.js
  echo '{"name":"@mongodb-js/saslprep","version":"1.1.0","main":"dist/node.js"}' > node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist/package.json
fi
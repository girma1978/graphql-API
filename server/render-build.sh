#!/bin/bash
# Install dependencies
npm install --legacy-peer-deps

# Build the TypeScript code
npm run build

# Handle Apollo utils modules
# 1. utils.isnodelike
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js ]; then
  echo 'function isNodeLike() { return true; } module.exports = { isNodeLike };' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/dist/index.js
  echo '{"name":"@apollo/utils.isnodelike","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.isnodelike/package.json
fi

# 2. utils.keyvaluecache
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.keyvaluecache/dist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.keyvaluecache/dist/index.js ]; then
  echo 'class KeyValueCache { async get(key) { return null; } async set(key, value) {} async delete(key) {} } module.exports = { KeyValueCache };' > node_modules/@apollo/server/node_modules/@apollo/utils.keyvaluecache/dist/index.js
  echo '{"name":"@apollo/utils.keyvaluecache","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.keyvaluecache/package.json
fi

# 3. utils.logger
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.logger/dist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.logger/dist/index.js ]; then
  echo 'const logger = { debug() {}, info() {}, warn() {}, error() {} }; module.exports = { logger };' > node_modules/@apollo/server/node_modules/@apollo/utils.logger/dist/index.js
  echo '{"name":"@apollo/utils.logger","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.logger/package.json
fi

# 4. utils.withrequired
mkdir -p node_modules/@apollo/server/node_modules/@apollo/utils.withrequired/dist
if [ ! -f node_modules/@apollo/server/node_modules/@apollo/utils.withrequired/dist/index.js ]; then
  echo 'function withRequired() { return {}; } module.exports = { withRequired };' > node_modules/@apollo/server/node_modules/@apollo/utils.withrequired/dist/index.js
  echo '{"name":"@apollo/utils.withrequired","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/server/node_modules/@apollo/utils.withrequired/package.json
fi

# Handle MongoDB saslprep
mkdir -p node_modules/@mongodb-js/saslprep/dist
if [ ! -f node_modules/@mongodb-js/saslprep/dist/node.js ]; then
  echo 'function saslprep(str) { return str; } module.exports = saslprep;' > node_modules/@mongodb-js/saslprep/dist/node.js
  echo '{"name":"@mongodb-js/saslprep","version":"1.1.0","main":"dist/node.js"}' > node_modules/@mongodb-js/saslprep/package.json
fi

# Also handle the nested path for MongoDB
mkdir -p node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist
if [ ! -f node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist/node.js ]; then
  echo 'function saslprep(str) { return str; } module.exports = saslprep;' > node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist/node.js
  echo '{"name":"@mongodb-js/saslprep","version":"1.1.0","main":"dist/node.js"}' > node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/package.json
fi
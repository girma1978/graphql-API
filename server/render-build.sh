#!/bin/bash
# Install dependencies
npm install --legacy-peer-deps

# Rebuild bcrypt for the current platform
npm rebuild bcrypt --build-from-source

# Build the TypeScript code
npm run build

# Handle Apollo utils modules
handle_apollo_utils() {
  local module_name="$1"
  local module_path="node_modules/@apollo/server/node_modules/@apollo/$module_name/dist"
  local index_file="$module_path/index.js"
  local package_file="$module_path/package.json"

  mkdir -p "$module_path"
  if [ ! -f "$index_file" ]; then
    echo "Creating $index_file"
    case "$module_name" in
      utils.isnodelike)
        echo 'function isNodeLike() { return true; } module.exports = { isNodeLike };' > "$index_file"
        ;;
      utils.keyvaluecache)
        echo 'class KeyValueCache { async get(key) { return null; } async set(key, value) {} async delete(key) {} } module.exports = { KeyValueCache };' > "$index_file"
        ;;
      utils.logger)
        echo 'const logger = { debug() {}, info() {}, warn() {}, error() {} }; module.exports = { logger };' > "$index_file"
        ;;
      utils.withrequired)
        echo 'function withRequired() { return {}; } module.exports = { withRequired };' > "$index_file"
        ;;
      utils.createhash)
        echo 'function createHash(value) { return String(value); } module.exports = { createHash };' > "$index_file"
        ;;
      *)
        echo "Warning: Unknown Apollo utils module: $module_name"
        return 1
        ;;
    esac
    echo "{\"name\":\"@apollo/$module_name\",\"version\":\"1.0.0\",\"main\":\"dist/index.js\"}" > "$package_file"
  fi
}

handle_apollo_utils utils.isnodelike
handle_apollo_utils utils.keyvaluecache
handle_apollo_utils utils.logger
handle_apollo_utils utils.withrequired
handle_apollo_utils utils.createhash

# Also handle the direct path for createhash
mkdir -p node_modules/@apollo/utils.createhash/dist
if [ ! -f node_modules/@apollo/utils.createhash/dist/index.js ]; then
  echo 'function createHash(value) { return String(value); } module.exports = { createHash };' > node_modules/@apollo/utils.createhash/dist/index.js
  echo '{"name":"@apollo/utils.createhash","version":"1.0.0","main":"dist/index.js"}' > node_modules/@apollo/utils.createhash/package.json
fi

# Handle MongoDB saslprep
handle_mongodb_saslprep() {
  local module_path="$1"
  local node_file="$module_path/node.js"
  local package_file="$module_path/package.json"

  mkdir -p "$module_path"
  if [ ! -f "$node_file" ]; then
    echo "Creating $node_file"
    echo 'function saslprep(str) { return str; } module.exports = saslprep;' > "$node_file"
    echo '{"name":"@mongodb-js/saslprep","version":"1.1.0","main":"dist/node.js"}' > "$package_file"
  fi
}

handle_mongodb_saslprep "node_modules/@mongodb-js/saslprep/dist"
handle_mongodb_saslprep "node_modules/mongoose/node_modules/mongodb/node_modules/@mongodb-js/saslprep/dist"
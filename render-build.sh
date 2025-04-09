#!/bin/bash
echo "Running build script..."

# Fix server build
cd server
echo "Moved to server directory"
npm install
echo "npm install in server done"
chmod +x node_modules/.bin/node-pre-gyp
echo "chmod +x done"
npm rebuild bcrypt --build-from-source
echo "bcrypt rebuild done"
npm run build
echo "Server build done"
cd ..
echo "Moved to root directory"

# Create wrapper.js file
echo "Creating wrapper.js..."
cat > wrapper.js << 'EOF'
// wrapper.js
import './server/dist/server.js';
console.log('Wrapper initialized - loading server...');
EOF

# Create root package.json for ES modules
echo "Creating root package.json for ES modules..."
cat > package.json << 'EOF'
{
  "name": "app-wrapper",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "start": "node wrapper.js"
  }
}
EOF

echo "Wrapper and package.json created"
echo "Build complete"

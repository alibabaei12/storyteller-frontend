#!/bin/bash
set -e

echo "===== Environment Information ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

echo "===== Cleaning node_modules ====="
rm -rf node_modules
rm -f package-lock.json

echo "===== Installing dependencies ====="
npm install --legacy-peer-deps --include=dev

echo "===== Installing specific dependencies ====="
npm install --legacy-peer-deps --no-save ajv@^6.12.6 ajv-keywords@^3.5.2

echo "===== Installing react-scripts explicitly ====="
npm install --legacy-peer-deps react-scripts@5.0.1

echo "===== Building using node_modules path instead of npx ====="
echo "PATH before: $PATH"
export PATH="$PWD/node_modules/.bin:$PATH"
echo "PATH after: $PATH"
echo "react-scripts location: $(which react-scripts || echo 'not found')"

echo "===== Building the application ====="
node ./node_modules/react-scripts/scripts/build.js

echo "===== Build completed =====" 
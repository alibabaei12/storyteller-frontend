#!/bin/bash
set -e

echo "===== Environment Information ====="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

echo "===== Cleaning node_modules ====="
rm -rf node_modules
rm -f package-lock.json

echo "===== Installing dependencies ====="
npm install --no-audit --no-fund --legacy-peer-deps

echo "===== Verifying installation ====="
echo "node_modules contents:"
ls -la node_modules/.bin/
echo "Looking for react-scripts:"
find node_modules -name "react-scripts" || echo "react-scripts not found in node_modules"

echo "===== Installing react-scripts explicitly ====="
npm install react-scripts --no-audit --no-fund --legacy-peer-deps

echo "===== Building the application ====="
# Using npx to ensure we're using the local version
npx react-scripts build 
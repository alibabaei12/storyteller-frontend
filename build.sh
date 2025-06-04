#!/bin/bash
set -e

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "===== Installing dependencies ====="
npm install

echo "===== Checking if react-scripts is available ====="
npx react-scripts --version || echo "react-scripts not found"

echo "===== Building the application ====="
npm run build 
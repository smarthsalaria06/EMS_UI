#!/bin/bash

# Install dependencies
npm install
npm install vite@latest
npm install react-router-dom
npm install autoprefix @reduxjs/toolkit react-redux react-icons -npx init -p
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install antd
npm install -g json-server json-server-auth

# Add the start-api script to package.json
jq '.scripts += {"start-api": "json-server --watch db.json --port 5000"}' package.json > temp.json && mv temp.json package.json

echo "Dependencies installed and package.json updated."

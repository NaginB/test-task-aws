#!/bin/bash

# Script to create a zip file with only necessary files for client delivery

ZIP_NAME="movie-management-app.zip"
TEMP_DIR="temp-export"

# Clean up any existing temp directory or zip
rm -rf "$TEMP_DIR" "$ZIP_NAME"

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "Creating zip file: $ZIP_NAME"
echo "Copying necessary files..."

# Copy root files
cp README.md "$TEMP_DIR/" 2>/dev/null
cp .gitignore "$TEMP_DIR/" 2>/dev/null
cp docker-compose.yml "$TEMP_DIR/" 2>/dev/null

# Copy backend (excluding node_modules, dist, .env, etc.)
echo "Copying backend..."
mkdir -p "$TEMP_DIR/backend"
cp -r backend/src "$TEMP_DIR/backend/"
cp backend/package.json "$TEMP_DIR/backend/"
cp backend/package-lock.json "$TEMP_DIR/backend/"
cp backend/tsconfig.json "$TEMP_DIR/backend/"
cp backend/nest-cli.json "$TEMP_DIR/backend/"
cp backend/Dockerfile "$TEMP_DIR/backend/"
cp backend/.dockerignore "$TEMP_DIR/backend/"
cp backend/.eslintrc.js "$TEMP_DIR/backend/"
cp backend/.prettierrc "$TEMP_DIR/backend/"
cp backend/.gitignore "$TEMP_DIR/backend/"
cp backend/README.md "$TEMP_DIR/backend/" 2>/dev/null

# Copy frontend (excluding node_modules, .next, .env, etc.)
echo "Copying frontend..."
mkdir -p "$TEMP_DIR/frontend"
cp -r frontend/app "$TEMP_DIR/frontend/"
cp -r frontend/components "$TEMP_DIR/frontend/"
cp -r frontend/forms "$TEMP_DIR/frontend/"
cp -r frontend/lib "$TEMP_DIR/frontend/"
cp -r frontend/public "$TEMP_DIR/frontend/"
cp -r frontend/store "$TEMP_DIR/frontend/"
cp frontend/package.json "$TEMP_DIR/frontend/"
cp frontend/package-lock.json "$TEMP_DIR/frontend/"
cp frontend/tsconfig.json "$TEMP_DIR/frontend/"
cp frontend/next.config.js "$TEMP_DIR/frontend/"
cp frontend/postcss.config.js "$TEMP_DIR/frontend/"
cp frontend/tailwind.config.js "$TEMP_DIR/frontend/"
cp frontend/.eslintrc.json "$TEMP_DIR/frontend/"
cp frontend/.gitignore "$TEMP_DIR/frontend/"
cp frontend/.dockerignore "$TEMP_DIR/frontend/"
cp frontend/Dockerfile "$TEMP_DIR/frontend/"
cp frontend/middleware.ts "$TEMP_DIR/frontend/"
cp frontend/next-env.d.ts "$TEMP_DIR/frontend/"
cp frontend/.env.example "$TEMP_DIR/frontend/" 2>/dev/null

# Create zip file
cd "$TEMP_DIR"
zip -r "../$ZIP_NAME" . -q
cd ..

# Clean up temp directory
rm -rf "$TEMP_DIR"

echo "✓ Zip file created: $ZIP_NAME"
echo "✓ File size: $(du -h $ZIP_NAME | cut -f1)"



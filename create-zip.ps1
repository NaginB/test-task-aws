# PowerShell script to create a zip file with only necessary files for client delivery

$ZipName = "movie-management-app.zip"
$TempDir = "temp-export"

# Clean up any existing temp directory or zip
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
if (Test-Path $ZipName) { Remove-Item -Force $ZipName }

# Create temp directory
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "Creating zip file: $ZipName"
Write-Host "Copying necessary files..."

# Copy root files
Copy-Item "README.md" "$TempDir\" -ErrorAction SilentlyContinue
Copy-Item ".gitignore" "$TempDir\" -ErrorAction SilentlyContinue
Copy-Item "docker-compose.yml" "$TempDir\" -ErrorAction SilentlyContinue

# Copy backend
Write-Host "Copying backend..."
New-Item -ItemType Directory -Path "$TempDir\backend" | Out-Null
Copy-Item -Recurse "backend\src" "$TempDir\backend\"
Copy-Item "backend\package.json" "$TempDir\backend\"
Copy-Item "backend\package-lock.json" "$TempDir\backend\"
Copy-Item "backend\tsconfig.json" "$TempDir\backend\"
Copy-Item "backend\nest-cli.json" "$TempDir\backend\"
Copy-Item "backend\Dockerfile" "$TempDir\backend\"
Copy-Item "backend\.dockerignore" "$TempDir\backend\"
Copy-Item "backend\.eslintrc.js" "$TempDir\backend\"
Copy-Item "backend\.prettierrc" "$TempDir\backend\"
Copy-Item "backend\.gitignore" "$TempDir\backend\"
Copy-Item "backend\README.md" "$TempDir\backend\" -ErrorAction SilentlyContinue

# Copy frontend
Write-Host "Copying frontend..."
New-Item -ItemType Directory -Path "$TempDir\frontend" | Out-Null
Copy-Item -Recurse "frontend\app" "$TempDir\frontend\"
Copy-Item -Recurse "frontend\components" "$TempDir\frontend\"
Copy-Item -Recurse "frontend\forms" "$TempDir\frontend\"
Copy-Item -Recurse "frontend\lib" "$TempDir\frontend\"
Copy-Item -Recurse "frontend\public" "$TempDir\frontend\"
Copy-Item -Recurse "frontend\store" "$TempDir\frontend\"
Copy-Item "frontend\package.json" "$TempDir\frontend\"
Copy-Item "frontend\package-lock.json" "$TempDir\frontend\"
Copy-Item "frontend\tsconfig.json" "$TempDir\frontend\"
Copy-Item "frontend\next.config.js" "$TempDir\frontend\"
Copy-Item "frontend\postcss.config.js" "$TempDir\frontend\"
Copy-Item "frontend\tailwind.config.js" "$TempDir\frontend\"
Copy-Item "frontend\.eslintrc.json" "$TempDir\frontend\"
Copy-Item "frontend\.gitignore" "$TempDir\frontend\"
Copy-Item "frontend\.dockerignore" "$TempDir\frontend\"
Copy-Item "frontend\Dockerfile" "$TempDir\frontend\"
Copy-Item "frontend\middleware.ts" "$TempDir\frontend\"
Copy-Item "frontend\next-env.d.ts" "$TempDir\frontend\"
Copy-Item "frontend\.env.example" "$TempDir\frontend\" -ErrorAction SilentlyContinue

# Create zip file
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipName -Force

# Clean up temp directory
Remove-Item -Recurse -Force $TempDir

$FileSize = (Get-Item $ZipName).Length / 1MB
Write-Host "✓ Zip file created: $ZipName"
Write-Host "✓ File size: $([math]::Round($FileSize, 2)) MB"



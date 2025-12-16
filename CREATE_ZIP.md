# Creating Zip File for Client Delivery

## Quick Instructions

### For Mac/Linux:

```bash
./create-zip.sh
```

### For Windows (PowerShell):

```powershell
.\create-zip.ps1
```

This will create `movie-management-app.zip` with only necessary files (excludes node_modules, .next, dist, .env files, etc.)

## What's Included:

- ✅ All source code (backend/src, frontend/app, components, etc.)
- ✅ Configuration files (package.json, tsconfig.json, etc.)
- ✅ README.md with instructions
- ✅ Docker files
- ✅ .gitignore files

## What's Excluded:

- ❌ node_modules
- ❌ .next (Next.js build)
- ❌ dist (backend build)
- ❌ .env files
- ❌ \*.db files
- ❌ uploads folder
- ❌ Log files

The client will need to run `npm install` in both backend and frontend directories after extracting.



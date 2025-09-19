param(
  [string]$Source = 'C:\Users\davos\OneDrive\Apps\App components\💬 LanguageGUI — A UI Kit for LLMs (Community) (1)',
  [string]$Slug = 'language-gui-kit'
)

# normalize project paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path $ScriptDir
$ImportRoot = Join-Path $ProjectRoot 'import'
if (!(Test-Path $ImportRoot)) { New-Item -ItemType Directory -Force -Path $ImportRoot | Out-Null }

$DestRaw = Join-Path $ImportRoot ($Slug + '-raw')
New-Item -ItemType Directory -Force -Path $DestRaw | Out-Null

Write-Host "Copying UI kit from:`n $Source`n-> $DestRaw" -ForegroundColor Cyan

if (!(Test-Path $Source)) {
  Write-Error "Source path not found: $Source"
  exit 1
}

# Perform copy (retain structure)
Copy-Item -Path (Join-Path $Source '*') -Destination $DestRaw -Recurse -Force -ErrorAction Stop

# Generate extension inventory
$extReport = Get-ChildItem -Recurse $DestRaw | Where-Object { -not $_.PSIsContainer } | Group-Object Extension | Sort-Object Count -Descending |
  ForEach-Object { '{0}`t{1}' -f $_.Count, ($_.Name -replace '^\.', '') }
$extReport | Out-File (Join-Path $DestRaw 'INVENTORY_extensions.txt') -Encoding UTF8

# Generate full tree listing
$treeFile = Join-Path $DestRaw 'INVENTORY_tree.txt'
Get-ChildItem -Recurse $DestRaw | ForEach-Object { $_.FullName.Substring($DestRaw.Length + 1) } | Sort-Object |
  Out-File $treeFile -Encoding UTF8

# Create an ingest README with next steps
$readme = @"
# Language GUI Kit Import (Raw)

Source: `$Source`
Imported On: $(Get-Date -Format o)

## Contents
- INVENTORY_extensions.txt: Count of files by extension
- INVENTORY_tree.txt: Full relative file tree

## Next Steps
1. Classify assets:
   - /images -> move into public/vendor/$Slug/images
   - /icons (SVG) -> evaluate for optimization & sprite/React component generation
   - /fonts -> move to public/fonts and add @font-face declarations
2. Generate React component wrappers for reusable UI primitives.
3. Extract color palette / shadows into design tokens (`packages/brand/tokens/$Slug.json`).
4. Run an SVG optimization pass (e.g. SVGO) before promotion.
5. Verify license terms (add LICENSE if provided).

## Suggested Commands
# Optimize SVGs (example)
# npx svgo -f ./import/$Slug-raw --config=svgo.config.js

"@
$readme | Out-File (Join-Path $DestRaw 'README_IMPORT.md') -Encoding UTF8

Write-Host "Import completed. Inventory files created in $DestRaw" -ForegroundColor Green

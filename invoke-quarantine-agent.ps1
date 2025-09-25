<#
.SYNOPSIS
  Invokes the OurSynth quarantine agent to move an asset to the archive.
.PARAMETER SourcePath
  The relative path to the asset within the project to be quarantined.
.EXAMPLE
  ./invoke-quarantine-agent.ps1 -SourcePath "import-staging/legacy-storybook"
#>
param(
  [Parameter(Mandatory=$true)]
  [string]$SourcePath
)

Write-Host "🚀 Invoking Quarantine Agent for: $SourcePath"

# Execute the Node.js agent script and capture its output
node ./scripts/agents/quarantine.mjs --source=$SourcePath

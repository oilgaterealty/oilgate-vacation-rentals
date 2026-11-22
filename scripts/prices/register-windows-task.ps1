<#
.SYNOPSIS
Fallback Windows Scheduled Task runner for Oilgate Vacation Rentals daily prices.
Use this ONLY if GitHub Actions runners receive HTTP 429 from Lodgify.
Runs scripts/prices/fetch-prices.mjs using the local LODGIFY_API_KEY env var
and commits only data/prices.json to main when it changed.
#>
param(
  [string]$RepoPath = "C:\Users\vtae4\Oilgate-Builds\ovr-full-site-v3",
  [switch]$Register,
  [string]$RunTime = "06:15"
)

$ErrorActionPreference = "Stop"

if ($Register) {
  $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`" -RepoPath `"$RepoPath`""
  $trigger = New-ScheduledTaskTrigger -Daily -At $RunTime
  Register-ScheduledTask -TaskName "Oilgate-OVR-Daily-Prices" -Action $action -Trigger $trigger -Description "Daily 7-night price comparison refresh for Oilgate Vacation Rentals" -Force
  Write-Output "Registered scheduled task Oilgate-OVR-Daily-Prices at $RunTime daily."
  exit 0
}

Set-Location $RepoPath
git pull --ff-only origin main
node scripts/prices/fetch-prices.mjs
$changed = git status --porcelain -- data/prices.json
if (-not $changed) {
  Write-Output "No price changes."
  exit 0
}
git add data/prices.json
git commit -m "Update daily 7-night average prices"
git push origin main

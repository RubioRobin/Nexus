#!/usr/bin/env bash
set -euo pipefail

ISSUE_NUMBER="${1:-}"
TASK_ID="${2:-AUTO-TASK}"
TRACE_ID="${3:-NA}"
COMPANY_NAME_RAW="${4:-Tool}"
COMPANY_NAME="$(echo "$COMPANY_NAME_RAW" | sed -E 's/[^[:alnum:] _-]//g' | sed -E 's/^\s+|\s+$//g')"
if [[ -z "$COMPANY_NAME" ]]; then COMPANY_NAME="Tool"; fi

if [[ -z "$ISSUE_NUMBER" ]]; then
  echo "Usage: auto_build_from_issue.sh <issue_number> <task_id> <trace_id> [company_name]"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/projects/intake-builds/$TASK_ID"
SRC_DIR="$OUT_DIR/src/AutoAddin"
ART_DIR="$OUT_DIR/artifacts"
TEMPLATE="$ROOT/templates/revit-wpf-addon-template"

mkdir -p "$SRC_DIR" "$ART_DIR"
cp -f "$TEMPLATE"/* "$SRC_DIR"/

# Embed task details + company-based ribbon naming
python3 - <<PY
from pathlib import Path
p=Path("$SRC_DIR/MainWindow.xaml.cs")
s=p.read_text()
s=s.replace("__TASK_ID__", "$TASK_ID")
s=s.replace("__TRACE_ID__", "$TRACE_ID")
s=s.replace("__INTAKE_ID__", "$TASK_ID")
p.write_text(s)

p2=Path("$SRC_DIR/App.cs")
s2=p2.read_text()
s2=s2.replace("__COMPANY_NAME__", "$COMPANY_NAME")
p2.write_text(s2)
PY

pushd "$SRC_DIR" >/dev/null
if command -v dotnet >/dev/null 2>&1; then
  dotnet build AutoAddin.csproj -c Release
elif [[ -x "$HOME/.dotnet/dotnet" ]]; then
  "$HOME/.dotnet/dotnet" build AutoAddin.csproj -c Release
else
  echo "dotnet not found"
  exit 2
fi
popd >/dev/null

cp "$SRC_DIR/bin/Release/net8.0-windows/AutoAddin.dll" "$ART_DIR/${TASK_ID}.dll"
cat > "$ART_DIR/${TASK_ID}.addin" <<XML
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<RevitAddIns>
  <AddIn Type="Application">
    <Name>${COMPANY_NAME} Tool</Name>
    <Assembly>C:\\Users\\Robin\\AppData\\Roaming\\Autodesk\\Revit\\Addins\\2025\\${TASK_ID}.dll</Assembly>
    <AddInId>8A5E1285-31D3-4E9B-91F2-8DBEA3E7358D</AddInId>
    <FullClassName>AutoAddin.App</FullClassName>
    <VendorId>RBIN</VendorId>
    <VendorDescription>Robin BIM Automation</VendorDescription>
  </AddIn>
</RevitAddIns>
XML

cat > "$ART_DIR/install_${TASK_ID}.ps1" <<'PS1'
param(
  [string]$SourceDir = ".",
  [string]$TargetDir = "$env:APPDATA\\Autodesk\\Revit\\Addins\\2025"
)
New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
Copy-Item -Force (Join-Path $SourceDir "__TASK__.dll") (Join-Path $TargetDir "__TASK__.dll")
Copy-Item -Force (Join-Path $SourceDir "__TASK__.addin") (Join-Path $TargetDir "__TASK__.addin")
Write-Host "Installed __TASK__ to $TargetDir"
PS1
sed -i "s/__TASK__/${TASK_ID}/g" "$ART_DIR/install_${TASK_ID}.ps1"

cat > "$ART_DIR/install_${TASK_ID}.bat" <<BAT
@echo off
set SRC=%~dp0
set TARGET=%APPDATA%\Autodesk\Revit\Addins\2025
if not exist "%TARGET%" mkdir "%TARGET%"
copy /Y "%SRC%${TASK_ID}.dll" "%TARGET%\${TASK_ID}.dll"
copy /Y "%SRC%${TASK_ID}.addin" "%TARGET%\${TASK_ID}.addin"
echo Installed ${TASK_ID} to %TARGET%
BAT

if command -v zip >/dev/null 2>&1; then
  (cd "$ART_DIR" && zip -q "${TASK_ID}_package.zip" "${TASK_ID}.dll" "${TASK_ID}.addin" "install_${TASK_ID}.ps1" "install_${TASK_ID}.bat")
fi

echo "Built artifacts in: $ART_DIR"

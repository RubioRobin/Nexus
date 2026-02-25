#!/usr/bin/env bash
set -euo pipefail

ISSUE_NUMBER="${1:-}"
TASK_ID="${2:-AUTO-TASK}"
TRACE_ID="${3:-NA}"

if [[ -z "$ISSUE_NUMBER" ]]; then
  echo "Usage: auto_build_from_issue.sh <issue_number> <task_id> <trace_id>"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/projects/intake-builds/$TASK_ID"
SRC_DIR="$OUT_DIR/src/AutoAddin"
ART_DIR="$OUT_DIR/artifacts"
TEMPLATE="$ROOT/templates/revit-wpf-addon-template"

mkdir -p "$SRC_DIR" "$ART_DIR"
cp -f "$TEMPLATE"/* "$SRC_DIR"/

# Embed task details in generated window text
python3 - <<PY
from pathlib import Path
p=Path("$SRC_DIR/MainWindow.xaml.cs")
s=p.read_text()
s=s.replace("Deze add-in is automatisch opgebouwd vanuit intake.\\n\\nPas nu de businesslogica aan en lever .dll + .addin op.", f"Auto-build voor taak: $TASK_ID\\nTrace: $TRACE_ID\\nIssue: #$ISSUE_NUMBER")
p.write_text(s)
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
  <AddIn Type="Command">
    <Name>${TASK_ID}</Name>
    <Assembly>C:\\Users\\Robin\\AppData\\Roaming\\Autodesk\\Revit\\Addins\\2025\\${TASK_ID}.dll</Assembly>
    <AddInId>8A5E1285-31D3-4E9B-91F2-8DBEA3E7358D</AddInId>
    <FullClassName>AutoAddin.AutoCommand</FullClassName>
    <VendorId>RBIN</VendorId>
    <VendorDescription>Robin BIM Automation</VendorDescription>
  </AddIn>
</RevitAddIns>
XML

echo "Built artifacts in: $ART_DIR"

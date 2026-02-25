# Batch Sheet Renamer v1 (Revit Add-in)

MVP add-in om meerdere sheets tegelijk te hernoemen met:
- Prefix
- Suffix
- Find/Replace
- Preview
- Apply

## Projectstructuur

- `BatchSheetRenamer.sln`
- `src/BatchSheetRenamer/` (C# broncode)
- `artifacts/BatchSheetRenamer.dll`
- `artifacts/BatchSheetRenamer.addin`
- `build-logs/01-restore.log`
- `build-logs/02-build.log`

## Build

```bash
export PATH="$HOME/.dotnet:$PATH"
cd /home/rubiorobin/.openclaw/workspace/projects/revit-batch-sheet-renamer-v1
dotnet restore BatchSheetRenamer.sln
dotnet build BatchSheetRenamer.sln -c Release -v minimal
```

## Install (Revit 2025)

1. Kopieer `artifacts/BatchSheetRenamer.addin` naar:
   - `%AppData%\Autodesk\Revit\Addins\2025\`
2. Zorg dat `artifacts/BatchSheetRenamer.dll` op het pad staat dat in de `.addin` file staat.
3. Start Revit opnieuw.

## Korte testinstructie (Robin)

1. Open een model met meerdere sheets.
2. Start command **Batch Sheet Renamer**.
3. Vul bijv. in:
   - Prefix: `A-`
   - Suffix: `-REV1`
   - Find: `Plattegrond`
   - Replace: `Floor Plan`
4. Klik **Preview** en controleer kolom “Nieuwe naam (preview)”.
5. Laat 1-2 sheets uitvinken als controle.
6. Klik **Apply**.
7. Verifieer dat alleen geselecteerde sheets zijn hernoemd.

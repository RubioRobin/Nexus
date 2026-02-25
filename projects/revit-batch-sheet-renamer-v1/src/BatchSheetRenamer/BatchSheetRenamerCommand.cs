using System;
using System.Collections.Generic;
using System.Linq;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

namespace BatchSheetRenamer
{
    [Transaction(TransactionMode.Manual)]
    public class BatchSheetRenamerCommand : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            UIDocument uiDoc = commandData.Application.ActiveUIDocument;
            if (uiDoc == null || uiDoc.Document == null)
            {
                message = "Geen actief Revit document.";
                return Result.Failed;
            }

            Document doc = uiDoc.Document;

            List<ViewSheet> sheets = new FilteredElementCollector(doc)
                .OfClass(typeof(ViewSheet))
                .Cast<ViewSheet>()
                .Where(s => !s.IsPlaceholder)
                .OrderBy(s => s.SheetNumber)
                .ToList();

            if (sheets.Count == 0)
            {
                TaskDialog.Show("Batch Sheet Renamer", "Geen sheets gevonden.");
                return Result.Succeeded;
            }

            var form = new BatchSheetRenamerForm(sheets);
            var dialogResult = form.ShowDialog();
            if (dialogResult != true)
            {
                return Result.Cancelled;
            }

            RenameRule rule = form.GetRule();
            List<SheetPreviewItem> selectedItems = form.GetSelectedPreviewItems();

            if (selectedItems.Count == 0)
            {
                TaskDialog.Show("Batch Sheet Renamer", "Geen sheets geselecteerd om te hernoemen.");
                return Result.Cancelled;
            }

            var result = SheetRenamerService.Apply(doc, selectedItems, rule);

            if (!string.IsNullOrEmpty(result.Error))
            {
                message = result.Error;
                return Result.Failed;
            }

            TaskDialog.Show("Batch Sheet Renamer", $"Klaar. {result.RenamedCount} sheets hernoemd.");
            return Result.Succeeded;
        }
    }
}

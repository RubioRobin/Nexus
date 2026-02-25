using System;
using System.Collections.Generic;
using Autodesk.Revit.DB;

namespace BatchSheetRenamer
{
    public static class SheetRenamerService
    {
        public static string BuildPreviewName(string originalName, RenameRule rule)
        {
            string baseName = originalName ?? string.Empty;

            if (!string.IsNullOrEmpty(rule.FindText))
            {
                baseName = baseName.Replace(rule.FindText, rule.ReplaceText ?? string.Empty);
            }

            return $"{rule.Prefix ?? string.Empty}{baseName}{rule.Suffix ?? string.Empty}";
        }

        public static ApplyResult Apply(Document doc, List<SheetPreviewItem> selectedItems, RenameRule rule)
        {
            ApplyResult result = new ApplyResult();

            try
            {
                using (Transaction tx = new Transaction(doc, "Batch Sheet Rename"))
                {
                    tx.Start();

                    foreach (SheetPreviewItem item in selectedItems)
                    {
                        var element = doc.GetElement(item.SheetId) as ViewSheet;
                        if (element == null)
                        {
                            continue;
                        }

                        string newName = BuildPreviewName(element.Name, rule);
                        if (!string.Equals(element.Name, newName, StringComparison.Ordinal))
                        {
                            element.Name = newName;
                            result.RenamedCount++;
                        }
                    }

                    tx.Commit();
                }
            }
            catch (Exception ex)
            {
                result.Error = ex.Message;
            }

            return result;
        }
    }
}

namespace BatchSheetRenamer
{
    public class RenameRule
    {
        public string Prefix { get; set; }
        public string Suffix { get; set; }
        public string FindText { get; set; }
        public string ReplaceText { get; set; }
    }

    public class SheetPreviewItem
    {
        public string SheetNumber { get; set; }
        public string OriginalName { get; set; }
        public string PreviewName { get; set; }
        public Autodesk.Revit.DB.ElementId SheetId { get; set; }
        public bool Selected { get; set; }
    }

    public class ApplyResult
    {
        public int RenamedCount { get; set; }
        public string Error { get; set; }
    }
}

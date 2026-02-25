using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;

namespace AutoAddin
{
    [Transaction(TransactionMode.Manual)]
    public class AutoCommand : IExternalCommand
    {
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            var win = new MainWindow();
            win.ShowDialog();
            return Result.Succeeded;
        }
    }
}

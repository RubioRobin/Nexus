using System;
using System.IO;
using System.Reflection;
using System.Windows.Media.Imaging;
using Autodesk.Revit.UI;

namespace AutoAddin
{
    public class App : IExternalApplication
    {
        public Result OnStartup(UIControlledApplication application)
        {
            string tabName = "Nexus";
            string panelName = "__COMPANY_NAME__";
            string buttonText = string.IsNullOrWhiteSpace(panelName) ? "Tool" : panelName;

            try
            {
                try { application.CreateRibbonTab(tabName); } catch { }
                var panel = application.CreateRibbonPanel(tabName, panelName);

                string assemblyPath = Assembly.GetExecutingAssembly().Location;
                var data = new PushButtonData("AutoAddinButton", buttonText, assemblyPath, "AutoAddin.AutoCommand");
                var button = panel.AddItem(data) as PushButton;

                // Optional icon if present in same folder
                string iconPath = Path.Combine(Path.GetDirectoryName(assemblyPath) ?? string.Empty, "icon32.png");
                if (button != null && File.Exists(iconPath))
                {
                    var img = new BitmapImage(new Uri(iconPath));
                    button.LargeImage = img;
                }
            }
            catch
            {
                return Result.Failed;
            }

            return Result.Succeeded;
        }

        public Result OnShutdown(UIControlledApplication application)
        {
            return Result.Succeeded;
        }
    }
}

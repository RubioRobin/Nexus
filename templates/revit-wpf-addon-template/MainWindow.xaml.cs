using System;
using System.IO;
using System.Windows;

namespace AutoAddin
{
    public partial class MainWindow : Window
    {
        private const string TaskId = "__TASK_ID__";
        private const string TraceId = "__TRACE_ID__";
        private const string IntakeId = "__INTAKE_ID__";

        public MainWindow()
        {
            InitializeComponent();
            TxtSummary.Text =
                $"Intake: {IntakeId}\n" +
                $"Build: {TaskId}\n" +
                $"Trace: {TraceId}\n\n" +
                "Deze add-in heeft een werkende testactie en is klaar als basis voor verdere intake-specifieke logica.";

            TxtResult.Text = "Nog geen testactie uitgevoerd.";
        }

        private void RunTest_Click(object sender, RoutedEventArgs e)
        {
            string msg =
                "✅ Testactie uitgevoerd\n\n" +
                $"Project: {AddinRuntimeContext.DocumentTitle}\n" +
                $"Build: {TaskId}\n" +
                $"Tijd: {DateTime.Now:yyyy-MM-dd HH:mm:ss}";

            TxtResult.Text = msg;
            MessageBox.Show(msg, "NEXUS Auto Add-in", MessageBoxButton.OK, MessageBoxImage.Information);

            try
            {
                var logDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "NexusAddinLogs");
                Directory.CreateDirectory(logDir);
                var logPath = Path.Combine(logDir, $"{TaskId}.log");
                File.AppendAllText(logPath, $"[{DateTime.Now:O}] RunTest in '{AddinRuntimeContext.DocumentTitle}'\n");
            }
            catch
            {
                // best effort logging
            }
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}

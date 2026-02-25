using System.Windows;

namespace AutoAddin
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            TxtSummary.Text = "Deze add-in is automatisch opgebouwd vanuit intake.\n\nPas nu de businesslogica aan en lever .dll + .addin op.";
        }

        private void Close_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}

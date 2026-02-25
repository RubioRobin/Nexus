using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows;
using Autodesk.Revit.DB;

namespace BatchSheetRenamer
{
    public partial class BatchSheetRenamerForm : Window, INotifyPropertyChanged
    {
        private readonly List<ViewSheet> _sheets;

        private string _prefix = string.Empty;
        private string _suffix = string.Empty;
        private string _findText = string.Empty;
        private string _replaceText = string.Empty;

        public event PropertyChangedEventHandler PropertyChanged;

        public ObservableCollection<SheetPreviewRow> Items { get; } = new ObservableCollection<SheetPreviewRow>();

        public string Prefix
        {
            get => _prefix;
            set { _prefix = value ?? string.Empty; OnPropertyChanged(); }
        }

        public string Suffix
        {
            get => _suffix;
            set { _suffix = value ?? string.Empty; OnPropertyChanged(); }
        }

        public string FindText
        {
            get => _findText;
            set { _findText = value ?? string.Empty; OnPropertyChanged(); }
        }

        public string ReplaceText
        {
            get => _replaceText;
            set { _replaceText = value ?? string.Empty; OnPropertyChanged(); }
        }

        public BatchSheetRenamerForm(List<ViewSheet> sheets)
        {
            _sheets = sheets ?? new List<ViewSheet>();
            InitializeComponent();
            DataContext = this;
            RefreshPreview();
        }

        public RenameRule GetRule()
        {
            return new RenameRule
            {
                Prefix = Prefix,
                Suffix = Suffix,
                FindText = FindText,
                ReplaceText = ReplaceText
            };
        }

        public List<SheetPreviewItem> GetSelectedPreviewItems()
        {
            return Items
                .Where(i => i.Selected)
                .Select(i => new SheetPreviewItem
                {
                    Selected = true,
                    SheetNumber = i.SheetNumber,
                    OriginalName = i.OriginalName,
                    PreviewName = i.PreviewName,
                    SheetId = i.SheetId
                })
                .ToList();
        }

        private void RefreshPreview()
        {
            var rule = GetRule();

            Items.Clear();
            foreach (var sheet in _sheets)
            {
                var previewName = SheetRenamerService.BuildPreviewName(sheet.Name, rule);
                Items.Add(new SheetPreviewRow
                {
                    Selected = true,
                    SheetNumber = sheet.SheetNumber,
                    OriginalName = sheet.Name,
                    PreviewName = previewName,
                    SheetId = sheet.Id
                });
            }
        }

        private void Preview_Click(object sender, RoutedEventArgs e)
        {
            RefreshPreview();
        }

        private void SelectAll_Click(object sender, RoutedEventArgs e)
        {
            foreach (var item in Items)
            {
                item.Selected = true;
            }
        }

        private void SelectNone_Click(object sender, RoutedEventArgs e)
        {
            foreach (var item in Items)
            {
                item.Selected = false;
            }
        }

        private void Apply_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
            Close();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }

        private void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    public class SheetPreviewRow : INotifyPropertyChanged
    {
        private bool _selected;

        public event PropertyChangedEventHandler PropertyChanged;

        public bool Selected
        {
            get => _selected;
            set
            {
                if (_selected == value) return;
                _selected = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(Selected)));
            }
        }

        public string SheetNumber { get; set; }
        public string OriginalName { get; set; }
        public string PreviewName { get; set; }
        public ElementId SheetId { get; set; }
    }
}

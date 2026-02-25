using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Autodesk.Revit.DB;
using WinForms = System.Windows.Forms;

namespace BatchSheetRenamer
{
    public class BatchSheetRenamerForm : WinForms.Form
    {
        private readonly List<ViewSheet> _sheets;
        private readonly WinForms.TextBox _txtPrefix;
        private readonly WinForms.TextBox _txtSuffix;
        private readonly WinForms.TextBox _txtFind;
        private readonly WinForms.TextBox _txtReplace;
        private readonly WinForms.DataGridView _grid;

        public BatchSheetRenamerForm(List<ViewSheet> sheets)
        {
            _sheets = sheets;

            Text = "Batch Sheet Renamer (MVP)";
            Width = 980;
            Height = 640;
            StartPosition = WinForms.FormStartPosition.CenterScreen;
            Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point);

            WinForms.Label lblPrefix = new WinForms.Label { Left = 16, Top = 16, Width = 80, Text = "Prefix" };
            _txtPrefix = new WinForms.TextBox { Left = 100, Top = 12, Width = 220 };

            WinForms.Label lblSuffix = new WinForms.Label { Left = 340, Top = 16, Width = 80, Text = "Suffix" };
            _txtSuffix = new WinForms.TextBox { Left = 424, Top = 12, Width = 220 };

            WinForms.Label lblFind = new WinForms.Label { Left = 16, Top = 48, Width = 80, Text = "Find" };
            _txtFind = new WinForms.TextBox { Left = 100, Top = 44, Width = 220 };

            WinForms.Label lblReplace = new WinForms.Label { Left = 340, Top = 48, Width = 80, Text = "Replace" };
            _txtReplace = new WinForms.TextBox { Left = 424, Top = 44, Width = 220 };

            WinForms.Button btnPreview = new WinForms.Button { Left = 670, Top = 12, Width = 120, Height = 28, Text = "Preview" };
            btnPreview.Click += (_, __) => RefreshPreview();

            WinForms.Button btnSelectAll = new WinForms.Button { Left = 804, Top = 12, Width = 140, Height = 28, Text = "Selecteer alles" };
            btnSelectAll.Click += (_, __) => SetAllRowsSelection(true);

            WinForms.Button btnSelectNone = new WinForms.Button { Left = 804, Top = 44, Width = 140, Height = 28, Text = "Selecteer niets" };
            btnSelectNone.Click += (_, __) => SetAllRowsSelection(false);

            _grid = new WinForms.DataGridView
            {
                Left = 16,
                Top = 84,
                Width = 928,
                Height = 460,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                AutoSizeColumnsMode = WinForms.DataGridViewAutoSizeColumnsMode.Fill,
                SelectionMode = WinForms.DataGridViewSelectionMode.FullRowSelect,
                MultiSelect = false
            };

            _grid.Columns.Add(new WinForms.DataGridViewCheckBoxColumn { Name = "Selected", HeaderText = "Apply", FillWeight = 10 });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "SheetNumber", HeaderText = "Sheet #", FillWeight = 20, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "OriginalName", HeaderText = "Huidige naam", FillWeight = 35, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "PreviewName", HeaderText = "Nieuwe naam (preview)", FillWeight = 35, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "SheetId", Visible = false });

            WinForms.Button btnApply = new WinForms.Button { Left = 724, Top = 560, Width = 100, Height = 30, Text = "Apply" };
            btnApply.Click += (_, __) =>
            {
                DialogResult = WinForms.DialogResult.OK;
                Close();
            };

            WinForms.Button btnCancel = new WinForms.Button { Left = 844, Top = 560, Width = 100, Height = 30, Text = "Cancel" };
            btnCancel.Click += (_, __) =>
            {
                DialogResult = WinForms.DialogResult.Cancel;
                Close();
            };

            Controls.AddRange(new WinForms.Control[]
            {
                lblPrefix, _txtPrefix, lblSuffix, _txtSuffix,
                lblFind, _txtFind, lblReplace, _txtReplace,
                btnPreview, btnSelectAll, btnSelectNone,
                _grid, btnApply, btnCancel
            });

            RefreshPreview();
        }

        public RenameRule GetRule()
        {
            return new RenameRule
            {
                Prefix = _txtPrefix.Text,
                Suffix = _txtSuffix.Text,
                FindText = _txtFind.Text,
                ReplaceText = _txtReplace.Text
            };
        }

        public List<SheetPreviewItem> GetSelectedPreviewItems()
        {
            return _grid.Rows.Cast<WinForms.DataGridViewRow>()
                .Where(r => Convert.ToBoolean(r.Cells["Selected"].Value))
                .Select(r => new SheetPreviewItem
                {
                    Selected = true,
                    SheetNumber = Convert.ToString(r.Cells["SheetNumber"].Value),
                    OriginalName = Convert.ToString(r.Cells["OriginalName"].Value),
                    PreviewName = Convert.ToString(r.Cells["PreviewName"].Value),
                    SheetId = new ElementId(Convert.ToInt64(r.Cells["SheetId"].Value))
                })
                .ToList();
        }

        private void RefreshPreview()
        {
            RenameRule rule = GetRule();

            _grid.Rows.Clear();
            foreach (ViewSheet s in _sheets)
            {
                string previewName = SheetRenamerService.BuildPreviewName(s.Name, rule);
                _grid.Rows.Add(true, s.SheetNumber, s.Name, previewName, s.Id.Value);
            }
        }

        private void SetAllRowsSelection(bool selected)
        {
            foreach (WinForms.DataGridViewRow row in _grid.Rows)
            {
                row.Cells["Selected"].Value = selected;
            }
        }
    }
}

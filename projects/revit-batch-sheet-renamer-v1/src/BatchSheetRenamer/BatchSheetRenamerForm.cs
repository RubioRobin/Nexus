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
        // House style tokens (aligned with ui/revit-style/BrandTokens.xaml)
        private static readonly Color ColorBg = ColorTranslator.FromHtml("#F6F8F7");
        private static readonly Color ColorCard = ColorTranslator.FromHtml("#FFFFFF");
        private static readonly Color ColorBorder = ColorTranslator.FromHtml("#D7E0DA");
        private static readonly Color ColorPrimary = ColorTranslator.FromHtml("#2F7D57");
        private static readonly Color ColorPrimaryHover = ColorTranslator.FromHtml("#286B4A");
        private static readonly Color ColorText = ColorTranslator.FromHtml("#1E2521");
        private static readonly Color ColorMuted = ColorTranslator.FromHtml("#5F6E66");

        private readonly List<ViewSheet> _sheets;
        private readonly WinForms.TextBox _txtPrefix;
        private readonly WinForms.TextBox _txtSuffix;
        private readonly WinForms.TextBox _txtFind;
        private readonly WinForms.TextBox _txtReplace;
        private readonly WinForms.DataGridView _grid;

        public BatchSheetRenamerForm(List<ViewSheet> sheets)
        {
            _sheets = sheets;

            Text = "Batch Sheet Renamer";
            Width = 980;
            Height = 640;
            StartPosition = WinForms.FormStartPosition.CenterScreen;
            Font = new Font("Segoe UI", 9F, FontStyle.Regular, GraphicsUnit.Point);
            BackColor = ColorBg;
            ForeColor = ColorText;

            var panelTop = new WinForms.Panel
            {
                Left = 16,
                Top = 12,
                Width = 928,
                Height = 72,
                BackColor = ColorCard,
                BorderStyle = WinForms.BorderStyle.FixedSingle
            };

            WinForms.Label lblPrefix = CreateLabel("Prefix", 12, 14, 80);
            _txtPrefix = CreateInput(96, 10, 220);

            WinForms.Label lblSuffix = CreateLabel("Suffix", 336, 14, 80);
            _txtSuffix = CreateInput(420, 10, 220);

            WinForms.Label lblFind = CreateLabel("Find", 12, 44, 80);
            _txtFind = CreateInput(96, 40, 220);

            WinForms.Label lblReplace = CreateLabel("Replace", 336, 44, 80);
            _txtReplace = CreateInput(420, 40, 220);

            WinForms.Button btnPreview = CreateButton("Preview", 668, 10, 120, true);
            btnPreview.Click += (_, __) => RefreshPreview();

            WinForms.Button btnSelectAll = CreateButton("Selecteer alles", 800, 10, 116, false);
            btnSelectAll.Click += (_, __) => SetAllRowsSelection(true);

            WinForms.Button btnSelectNone = CreateButton("Selecteer niets", 800, 40, 116, false);
            btnSelectNone.Click += (_, __) => SetAllRowsSelection(false);

            panelTop.Controls.AddRange(new WinForms.Control[]
            {
                lblPrefix, _txtPrefix, lblSuffix, _txtSuffix,
                lblFind, _txtFind, lblReplace, _txtReplace,
                btnPreview, btnSelectAll, btnSelectNone
            });

            _grid = new WinForms.DataGridView
            {
                Left = 16,
                Top = 92,
                Width = 928,
                Height = 452,
                AllowUserToAddRows = false,
                AllowUserToDeleteRows = false,
                AutoSizeColumnsMode = WinForms.DataGridViewAutoSizeColumnsMode.Fill,
                SelectionMode = WinForms.DataGridViewSelectionMode.FullRowSelect,
                MultiSelect = false,
                BackgroundColor = ColorCard,
                BorderStyle = WinForms.BorderStyle.FixedSingle,
                GridColor = ColorBorder,
                EnableHeadersVisualStyles = false,
                RowHeadersVisible = false
            };

            _grid.ColumnHeadersDefaultCellStyle.BackColor = ColorTranslator.FromHtml("#E8F2EC");
            _grid.ColumnHeadersDefaultCellStyle.ForeColor = ColorText;
            _grid.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 9F, FontStyle.Bold, GraphicsUnit.Point);
            _grid.DefaultCellStyle.BackColor = ColorCard;
            _grid.DefaultCellStyle.ForeColor = ColorText;
            _grid.DefaultCellStyle.SelectionBackColor = ColorTranslator.FromHtml("#DDEDE4");
            _grid.DefaultCellStyle.SelectionForeColor = ColorText;

            _grid.Columns.Add(new WinForms.DataGridViewCheckBoxColumn { Name = "Selected", HeaderText = "Apply", FillWeight = 10 });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "SheetNumber", HeaderText = "Sheet #", FillWeight = 20, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "OriginalName", HeaderText = "Huidige naam", FillWeight = 35, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "PreviewName", HeaderText = "Nieuwe naam (preview)", FillWeight = 35, ReadOnly = true });
            _grid.Columns.Add(new WinForms.DataGridViewTextBoxColumn { Name = "SheetId", Visible = false });

            var panelBottom = new WinForms.Panel
            {
                Left = 16,
                Top = 552,
                Width = 928,
                Height = 40,
                BackColor = Color.Transparent
            };

            var lblHint = new WinForms.Label
            {
                Left = 0,
                Top = 11,
                Width = 520,
                Text = "Controleer preview en klik Uitvoeren om de geselecteerde sheets te hernoemen.",
                ForeColor = ColorMuted
            };

            WinForms.Button btnApply = CreateButton("Uitvoeren", 700, 4, 108, true);
            btnApply.Click += (_, __) =>
            {
                DialogResult = WinForms.DialogResult.OK;
                Close();
            };

            WinForms.Button btnCancel = CreateButton("Annuleren", 820, 4, 108, false);
            btnCancel.Click += (_, __) =>
            {
                DialogResult = WinForms.DialogResult.Cancel;
                Close();
            };

            panelBottom.Controls.AddRange(new WinForms.Control[] { lblHint, btnApply, btnCancel });

            Controls.AddRange(new WinForms.Control[] { panelTop, _grid, panelBottom });

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

        private static WinForms.Label CreateLabel(string text, int left, int top, int width)
        {
            return new WinForms.Label
            {
                Left = left,
                Top = top,
                Width = width,
                Text = text,
                ForeColor = ColorText
            };
        }

        private static WinForms.TextBox CreateInput(int left, int top, int width)
        {
            return new WinForms.TextBox
            {
                Left = left,
                Top = top,
                Width = width,
                BorderStyle = WinForms.BorderStyle.FixedSingle,
                BackColor = Color.White,
                ForeColor = ColorText
            };
        }

        private static WinForms.Button CreateButton(string text, int left, int top, int width, bool primary)
        {
            var button = new WinForms.Button
            {
                Left = left,
                Top = top,
                Width = width,
                Height = 28,
                Text = text,
                FlatStyle = WinForms.FlatStyle.Flat,
                Cursor = WinForms.Cursors.Hand
            };

            button.FlatAppearance.BorderSize = 1;
            button.BackColor = primary ? ColorPrimary : Color.White;
            button.ForeColor = primary ? Color.White : ColorText;
            button.FlatAppearance.BorderColor = primary ? ColorPrimary : ColorBorder;

            if (primary)
            {
                button.MouseEnter += (_, __) => button.BackColor = ColorPrimaryHover;
                button.MouseLeave += (_, __) => button.BackColor = ColorPrimary;
            }

            return button;
        }
    }
}

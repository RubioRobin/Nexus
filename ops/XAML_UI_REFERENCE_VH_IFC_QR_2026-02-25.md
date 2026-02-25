# XAML/UI Reference — VH_IFC_QR (Robin input)

Datum: 2026-02-25
Doel: referentie-database voor gewenste Revit add-in UI/UX richting website-consistente stijl.
Bron: Robin webchat snippets (6 codeblokken).

## 1) ProgressWindow
**Patroon**
- Non-blocking progress updates via `Dispatcher.BeginInvoke(..., DispatcherPriority.Render)`.
- Custom draggable header (`Header_MouseDown` + `DragMove`).

**Belang voor standaard**
- UI blijft responsief tijdens export/process loops.
- Sluit aan op custom window-chrome stijl (geen standaard titlebar nodig).

## 2) ResultWindow
**Patroon**
- Resultatenlijst binden via `ItemsSource`.
- CTA naar web-admin pagina met `ProcessStartInfo` + `UseShellExecute = true`.
- Veilige foutafhandeling met duidelijke NL-foutmelding.

**Belang voor standaard**
- Sterke koppeling desktop add-in -> web platform flow.
- Heldere post-action voor gebruikers (“open project/admin”).

## 3) SelectionWindow
**Patroon**
- Mappingmodel `ViewSheetMapping` met selectie + gekoppelde sheet.
- Bulk select (`HeaderCheckBox`) en row select.
- Dynamische samenvatting (`Niets geselecteerd` / `X Views geselecteerd`).
- Validatie vóór run (project gekozen, prefix ingevuld, sheet aanwezig).
- Persistente user settings (last project/prefix) via `SettingsManager`.

**Belang voor standaard**
- Datagrid-gedreven workflow met duidelijke state.
- UX patroon voor veilige uitvoering + minder gebruikersfouten.

## 4) IfcSettingsWindow
**Patroon**
- Settings naar UI laden bij init.
- Culture-safe numerieke parsing (`,` -> `.` + `InvariantCulture`).
- Combo-tag mapping voor enum/choice opslag.
- Save/Cancel dialog patroon met `DialogResult`.

**Belang voor standaard**
- Sterke instellingenflow, lokaal-taalbestendig en reproduceerbaar.

## 5) NotificationWindow
**Patroon**
- Gestandaardiseerde notification dialog met type (`Info/Error/Warning`).
- Centrale statische helpers (`ShowError/ShowInfo/ShowWarning`).
- Consistente icon + title mapping.

**Belang voor standaard**
- Eén uniforme feedbackstijl door hele add-in.

## 6) AdminCommand
**Patroon**
- Revit `IExternalCommand` die web-admin/login opent.
- Simpele fail path met `message = ex.Message`.

**Belang voor standaard**
- Ribbon command als snelle bridge naar web tooling.

---

## Afgeleide UI-richtlijnen (voor codeur)
1. UI visueel alignen met website-stijl (kleuren, spacing, component-ritme, copy tone).
2. Elke add-in krijgt eigen Ribbon-knop.
3. Voorkeur: 32x32 icoon op Ribbon-knop (fallback tijdelijk zonder icoon toegestaan).
4. Herbruikbare componentset opbouwen:
   - Header/drag chrome
   - Progress state
   - Result state
   - Notification primitives
   - Form validation pattern
5. Alle user-facing teksten NL-consistent tenzij projectspec anders zegt.

## Nog gewenst van Robin om design-database compleet te maken
- XAML views (Window/UserControl) naast code-behind.
- ResourceDictionaries (colors, styles, templates).
- Eventuele website UI tokens (hex, typography, radius, spacing).
- Screenshot(s) van gewenste eindstijl.

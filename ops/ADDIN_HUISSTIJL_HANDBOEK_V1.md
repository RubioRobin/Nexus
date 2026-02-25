# Revit Add-in Huisstijl Handboek V1

Status: Active  
Datum: 2026-02-25  
Owner: Zeus (beheer) / Robin (final approval)

Doel: elke nieuwe add-in visueel en UX-technisch laten aansluiten op de website-huisstijl.

---

## 1) Niet-onderhandelbare standaarden

1. UI volgt website-stijl (kleurgevoel, componentvorm, spacing, toon).
2. Elke add-in heeft een eigen Ribbon-knop.
3. Voorkeur: Ribbon-knop met 32x32 icoon (tijdelijk zonder icoon mag alleen als tussenstap).
4. Geen release zonder `.dll` + `.addin` + build zonder errors/warnings.

---

## 2) Look-and-feel basis

- **Vormtaal:** afgeronde hoeken, rustige vlakken, subtiele contrasten.
- **Knoppen:** 1 duidelijke primary CTA per scherm, secundaire acties visueel lichter.
- **Spacing:** ruime marges/padding; geen overvolle dialogen.
- **Tekst:** kort, duidelijk, NL B1, actiegericht.
- **Statusfeedback:** altijd met tekst + kleur/icoon (succes, waarschuwing, fout).

---

## 3) Window structuur (standaard)

Elke hoofdwindow gebruikt dezelfde opbouw:

1. **Header:** titel + optionele subtitel/status, draggable indien custom chrome.
2. **Input-sectie:** velden gegroepeerd per taak.
3. **Controle/preview-sectie:** datagrid/summary vóór uitvoeren.
4. **Actiezone:** 1 primary knop (rechts), cancel/secondary apart.

Maximaal 3 hoofdstappen in één flow.

---

## 4) Componentregels

### Buttons
- Primary: accentkleur + duidelijke label (bijv. `Uitvoeren`, `Exporteren`).
- Secondary: neutraal, nooit concurreren met primary.
- Disabled-state zichtbaar maar leesbaar.

### DataGrid
- Kolommen kort en duidelijk benoemd.
- Multi-select altijd met bulkactie (`Selecteer alles / niets`) als relevant.
- Samenvattingsregel onder/boven grid met aantallen en ontbrekende data.

### Form validatie
- Blokkeer uitvoeren bij missende kerninput.
- Foutmelding bevat:
  - wat fout is
  - waar gebruiker moet corrigeren
  - wat daarna gebeurt

### Notifications
- Eén centrale notificatiecomponent gebruiken (`Info/Warning/Error`).
- Niet per scherm nieuwe popup-stijl uitvinden.

### Progress
- Bij acties >1s: progress UI tonen.
- UI-thread responsief houden (dispatcher pattern).

---

## 5) Verplichte implementatie-checklist per add-in

- [ ] Ribbon-paneel + eigen pushbutton aanwezig
- [ ] 32x32 icoon gekoppeld (of expliciet TODO met reden)
- [ ] XAML gebruikt gedeelde stijlresources
- [ ] Primary/secondary knophiërarchie correct
- [ ] Validatiepaden getest
- [ ] Statusmeldingen consistent
- [ ] NL copy gecontroleerd
- [ ] QA gate gehaald

---

## 6) Referentiebronnen (volgorde)

1. `VH_IFC_Viewer` (meest recente look/flow referentie)
2. `Nexus` website (merk en visuele richting)
3. `VH_addin` (functioneel hergebruik, visuele refactor toegestaan)

Zie ook:
- `ops/UI_STYLE_REQUIREMENTS_V1.md`
- `ops/DESIGN_REFERENCE.md`
- `ops/XAML_UI_REFERENCE_VH_IFC_QR_2026-02-25.md`

---

## 7) Afwijkingen

Afwijken van dit handboek mag alleen met expliciete Robin GO, inclusief reden in changelog/PR-notitie.

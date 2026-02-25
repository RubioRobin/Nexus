# UI Style & Requirements V1 (Nexus-lijn)

Status: Active
Updated: 2026-02-25
Owner: Robin (final approval) / Zeus (guardrail)
Scope: Revit add-ins + toekomstige websites

---

## 1) Design-principe (altijd)

- Rustig, professioneel, modern.
- Simpel Nederlands (B1) in teksten.
- Functioneel eerst: duidelijkheid boven flair.
- Eén visuele familie voor web + add-ins (Nexus stijlrichting).

Kernbelofte in UI: **minder repetitie, meer controle, sneller resultaat**.

---

## 2) Visuele richting (Nexus trend)

- Primair: rustige, natuurlijke groentinten.
- Achtergrond: licht en schoon (hoge leesbaarheid).
- Contrast: donker op licht voor hoofdtekst.
- CTA’s: duidelijk, compact, niet schreeuwerig.
- Vormtaal: afgeronde vierkante componenten (radius ±10–14px), géén pill-buttons als standaard.
- Zachte schaduw + veel witruimte voor duidelijke overzichtsblokken.

### Componentgevoel
- Buttons: solide primary + subtiele secondary.
- Cards/secties: zachte scheiding, geen drukke borders.
- Iconen: functioneel, eenvoudig, consistent formaat.

---

## 3) Typografie en leesbaarheid

- Korte zinnen, actieve taal.
- Geen lange blokken tekst; werk met bullets en duidelijke koppen.
- Max 1 kernboodschap per alinea.
- UI labels: kort en direct (bijv. "Start", "Controleren", "Exporteren").

---

## 4) Revit add-in UI regels

### 4.1 Interactie
- Maximaal 3 hoofdstappen per flow.
- Één primaire actie per scherm.
- Altijd zichtbaar:
  - wat er gebeurt
  - wat de impact is
  - wat de gebruiker daarna moet doen

### 4.2 Layout
- Compacte dialogen, geen overvolle panelen.
- Groeperen per taak (Input / Controle / Uitvoer).
- Defaults veilig en logisch.

### 4.3 Feedback
- Duidelijke statusmeldingen:
  - Succes (groen)
  - Waarschuwing (amber)
  - Fout (rood)
- Foutmeldingen altijd met: oorzaak + vervolgstap.

### 4.4 Performance/UX
- Geen blokkerende UI waar mogelijk.
- Progress-indicator bij acties > 1 sec.
- Geen dubbele bevestigingen voor simpele acties.

---

## 5) Website UI regels

- Homepage: directe waardepropositie in 1 scherm.
- CTA boven de vouw (zonder te scrollen zichtbaar).
- Cases/resultaten snel scanbaar met impact (tijd/repetitie besparing).
- Formulieren kort houden, alleen noodzakelijke velden.
- Gebruik klantvriendelijke toast-notificaties (geen technische backendtekst in UI).
- Overzichtsblokken verplicht: intakestatus, beslisstappen, expected output.
- Mobiel eerst leesbaar (responsive als standaard, niet als nagedachte).

---

## 6) Content & tone of voice

- Toon: helder, nuchter, vertrouwenwekkend.
- Vermijd hype-termen en vaag jargon.
- Schrijf vanuit resultaat:
  - tijdswinst
  - minder fouten
  - meer controle

Template voor feature-tekst:
1. Probleem
2. Wat de tool doet
3. Concreet resultaat

---

## 7) Toegankelijkheid (minimum)

- Voldoende kleurcontrast.
- Niet alleen kleur gebruiken om status aan te geven (ook icoon/tekst).
- Buttons en klikdoelen ruim genoeg.
- Toetsenbord-navigatie waar relevant.

---

## 8) Delivery-eisen voor Revit producten

Elke release-kandidaat bevat:
- `.dll`
- `.addin`
- Build zonder errors/warnings
- Korte gebruiksinstructie (wat, hoe, beperkingen)
- Changelog (wat is nieuw)

Gate blijft:
- QA PASS
- Robin GO

---

## 9) Definition of Ready voor UI werk

UI-werk mag pas naar build als dit bekend is:
- Doelgebruiker
- Top 1 taak die sneller moet
- Succesmaat (tijd/repetitie)
- Benodigde input/output
- Foutscenario’s

---

## 10) Governance

Deze stijlregels zijn default voor alle nieuwe add-ins en websites.
Afwijkingen mogen, maar alleen met expliciete Directie-keuze (Robin).

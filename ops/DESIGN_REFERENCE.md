# DESIGN REFERENCE — Robin baseline

Updated: 2026-02-25
Owner: Zeus
Purpose: vaste referentie voor productstijl (Revit add-ins + web) zodat consistentie behouden blijft.

## Primaire voorbeeldprojecten

1) VH_IFC_Viewer
- Repo: https://github.com/RubioRobin/VH_IFC_Viewer
- Rol: meest recente end-to-end setup (website + database + Revit add-in).
- Gebruik als referentie voor: integratie-flow, productvolwassenheid, gekoppelde architectuur.

2) Brood
- Repo: https://github.com/RubioRobin/Brood
- Rol: web-UX/style referentie.
- Gebruik als referentie voor: moderne UI, duidelijke flow, premium maar leesbare uitstraling.

3) VH_addin
- Repo: https://github.com/RubioRobin/VH_addin
- Rol: bestaande add-ins bibliotheek.
- Gebruik als referentie voor: Revit UI-patronen, compatibiliteit, build- en release-aanpak.

## Website/huisstijl richting
- Link: https://nexus-git-website-rubionexus-projects.vercel.app/
- Richting: in lijn met huidige look-and-feel van die site.
- Toegestaan: doorontwikkelen/aanscherpen in dezelfde visuele trend.

## Praktische ontwerpregels (werkstandaard)
- Consistent met huidige VH/Nexus visuele richting.
- Simpel, duidelijk, professioneel; geen onnodige visuele drukte.
- Revit add-ins: functioneel eerst, korte labels, lage cognitieve belasting.
- Web en add-in moeten als één merkfamilie aanvoelen.

## Open punt
- De Vercel site vroeg authenticatie tijdens fetch vanuit runtime.
- Actie: visuele details handmatig valideren via Robin input/screenshots als directe fetch niet beschikbaar is.

# NHHS AI: nettside

Nettsiden til NHHS AI (nhhsai.no). Netlify henter siden fra dette repoet og publiserer den automatisk hver gang `main` endres i mappa `public`.

## Mapper

| Sti | Innhold |
|---|---|
| `public/` | Selve nettsiden: forside, nyhetsside, bilder og datafil |
| `public/nyheter-data.js` | Alle nyhetssakene. Det er bare denne fila som endres hver uke |
| `verktoy/nyheter_verktoy.py` | Sjekker datafila og legger inn nye uker |
| `verktoy/nyheter_agenter.mjs` | Kjører workflowen med Claude API (Opus 5.5), nettsøk og kostnadsgrense |
| `.github/workflows/nyheter-ukentlig.yml` | Tidsplan og publisering: natt til lørdag, med tørrkjøring |
| `.claude/workflows/nyheter-ukentlig.js` | Beskriver hvordan en ukes nyheter blir funnet, faktasjekket og skrevet |
| `netlify.toml` | Sier at Netlify skal publisere `public` og hoppe over bygg når `public` ikke er endret |

## Ukentlig oppdatering

GitHub Actions (`.github/workflows/nyheter-ukentlig.yml`) kjører hver lørdag kl. 00.00 UTC, altså natt til lørdag (02.00 sommertid og 01.00 vintertid i Norge). Den starter `verktoy/nyheter_agenter.mjs`, som kjører `.claude/workflows/nyheter-ukentlig.js` med Claude Opus 5.5 via API-et: sju researchere, sammenslåing, faktasjekk, redaktør, korrektur og kodekontroll. Når `sjekk` er grønn, pushes `public/nyheter-data.js` til `main`, og Netlify publiserer siden.

Oppsett (gjøres én gang):

1. Lag en API-nøkkel i Claude Console (platform.claude.com) og sørg for at kontoen har kreditt.
2. Legg nøkkelen inn i repoet som secret: Settings, Secrets and variables, Actions, New repository secret. Navn: `ANTHROPIC_API_KEY`.
3. Kjør en tørrkjøring: Actions, Ukentlig nyhetsutgave, Run workflow. Tørrkjøring er på som standard og publiserer ingenting. Les `uke.json` og `rapport.md` under Artifacts.
4. Fjern haken for tørrkjøring når du er fornøyd, eller la lørdagskjøringen gjøre jobben.

Kostnaden estimeres i oppsummeringen for hver kjøring. Skriptet stopper av seg selv hvis estimatet går over `MAX_COST_USD` (30 USD, endres i workflow-fila). Modellen kan byttes med `MODEL`.

Feiler en kjøring, blir ingenting publisert, og GitHub sender e-post. Loggen ligger under Artifacts.

Uka hoppes over hvis den allerede finnes i datafila. Det betyr også at en planlagt oppgave i Claude som publiserer før kl. 00.00 UTC kan overta jobben. Bare én av de to bør være slått på.

## Kjøre sjekken selv

```
python3 verktoy/nyheter_verktoy.py sjekk
python3 verktoy/nyheter_verktoy.py neste-uke 2026-10-24
```

Feltene i datafila er forklart øverst i `public/nyheter-data.js`.

## Bra å vite

- Hver endring i `public` på `main` gir en ny produksjonsdeploy i Netlify, og det koster Netlify-kreditter. Samle derfor flere endringer i én commit når det er mulig.
- Skal du rette tekst for hånd, endre filene i `public/` og commit til `main`. Ikke last opp zip-filer til Netlify lenger. Da blir GitHub og nettsiden ute av takt.
- Netlify-agenten kan også endre nettsiden. Når den gjør det, må endringen havne i dette repoet, ellers blir den overskrevet av neste deploy.

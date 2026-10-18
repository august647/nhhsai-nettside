# NHHS AI: nettside

Nettsiden til NHHS AI (nhhsai.no). Netlify henter siden fra dette repoet og publiserer den automatisk hver gang `main` endres i mappa `public`.

## Mapper

| Sti | Innhold |
|---|---|
| `public/` | Selve nettsiden: forside, nyhetsside, bilder og datafil |
| `public/nyheter-data.js` | Alle nyhetssakene. Det er bare denne fila som endres hver uke |
| `verktoy/nyheter_verktoy.py` | Sjekker datafila og legger inn nye uker |
| `verktoy/nyheter_prompt.md` | Arbeidsinstruksen Claude Code får når utgaven lages med abonnement |
| `verktoy/bruksvokter.py` | Passer på bruksgrensene i abonnementet mens Claude jobber, og stopper kjøringen i tide |
| `verktoy/nyheter_agenter.mjs` | Kjører workflowen med Claude API (Opus 5.5), nettsøk og kostnadsgrense |
| `.github/workflows/nyheter-ukentlig.yml` | Reserveløsning og manuell knapp i GitHub, med tørrkjøring. Velger abonnement eller API |
| `.claude/workflows/nyheter-ukentlig.js` | Beskriver hvordan en ukes nyheter blir funnet, faktasjekket og skrevet |
| `netlify.toml` | Sier at Netlify skal publisere `public` og hoppe over bygg når `public` ikke er endret |

## Ukentlig oppdatering

Det er to ting som kan lage utgaven. Begge hopper over uka hvis den allerede finnes i datafila.

1. **Planlagt oppgave i Claude (hovedjobben).** Kjører natt til lørdag kl. 01.48 norsk tid, bruker Claude-abonnementet og trenger ingen nøkler. Den henter dette repoet, lager utgaven med subagenter og nettsøk, kjører `sjekk` og pusher `public/nyheter-data.js` til `main`.
2. **GitHub Actions (`.github/workflows/nyheter-ukentlig.yml`).** Reserveløsning og manuell knapp. Kjører lørdag kl. 04.00 UTC (06.00 sommertid, 05.00 vintertid) og gjør ingenting hvis hovedjobben har levert. Den kan logge inn på to måter:
   - **Abonnement** (secret `CLAUDE_CODE_OAUTH_TOKEN`): Claude Code kjører utgaven etter instruksen i `verktoy/nyheter_prompt.md`. Bruker Claude Pro-abonnementet, ingen API-kostnad.
   - **API** (secret `ANTHROPIC_API_KEY`): `verktoy/nyheter_agenter.mjs` kjører `.claude/workflows/nyheter-ukentlig.js` med Claude Opus 5.5 via API-et. Belaster API-kontoen.

Er begge secrets satt, velges abonnement. Du kan tvinge ett av dem med knappen «Run workflow», eller med repo-variabelen `NYHETER_METODE` (`abonnement` eller `api`). Modellen for abonnement er `claude-opus-5-5` og kan byttes med repo-variabelen `NYHETER_MODELL`, for eksempel til `claude-sonnet-5-5` hvis bruksgrensen i abonnementet blir for trang.

### Oppsett med abonnement (gjøres én gang)

1. Installer Claude Code på PC-en din. I PowerShell: `irm https://claude.ai/install.ps1 | iex`. Åpne et nytt PowerShell-vindu og sjekk at `claude --version` virker.
2. Kjør `claude setup-token`, logg inn i nettleseren med Claude-kontoen din og kopier tokenet som skrives ut. Tokenet gjelder i ett år. Claude Code lagrer det ikke noe sted, så kopier det med en gang.
3. Legg tokenet inn i repoet som secret: Settings, Secrets and variables, Actions, New repository secret. Navn: `CLAUDE_CODE_OAUTH_TOKEN`.
4. Kjør en tørrkjøring: Actions, Ukentlig nyhetsutgave, Run workflow, la «Tørrkjøring» stå på. Les `uke.json` og `rapport.md` under Artifacts. Ingenting publiseres.

### Bruksgrenser i abonnementet

Abonnementet har en bruksgrense per fem timer og en per uke, delt med claude.ai. En hel utgave kan bruke mer enn ett fem-timersvindu. Derfor er jobben laget slik at den kan stoppe og fortsette:

- Claude skriver hvert mellomresultat (sju søk, kandidatliste, faktasjekk i grupper på tre, utkast, korrektur) til mappa `arbeid/`.
- Jobben lagrer `arbeid/` på grenen `arbeid` i en mappe per uke, for eksempel `uke-42-2026/`, også når Claude blir stoppet. Grenen bygges ikke av Netlify.
- Neste kjøring av samme uke henter filene og hopper over det som er gjort. Bruk «Frisk start» i Run workflow for å begynne helt på nytt.
- `verktoy/bruksvokter.py` leser bruksmålingene i loggen og stopper Claude når en grense er nådd, når ukebruken når 95 % (endres med repo-variabelen `NYHETER_UKEGRENSE`, for eksempel `0.9`), eller etter 150 minutter. Da blir kjøringen rød med en forklaring i oppsummeringen. Ingenting publiseres.
- Oppsummeringen viser hvor mye av fem-timersvinduet og uka kjøringen brukte, og når de nullstilles.

Blir kjøringen stoppet, start den på nytt etter at grensen er nullstilt. Er det fem-timersgrensen, holder det å vente noen timer. Er det ukegrensen, må du vente til uka nullstilles. Bruker utgaven for mye, kan du bytte til en lettere modell med repo-variabelen `NYHETER_MODELL` (`claude-sonnet-5-5`).

### Oppsett med API

1. Lag en API-nøkkel i Claude Console (platform.claude.com) og sørg for at kontoen har kreditt.
2. Legg nøkkelen inn som secret `ANTHROPIC_API_KEY`.
3. Kjør en tørrkjøring som over.

Kostnaden estimeres i oppsummeringen for hver kjøring. Skriptet stopper av seg selv hvis estimatet går over `MAX_COST_USD` (30 USD, endres i workflow-fila). Modellen kan byttes med `MODEL`.

### Når noe feiler

Feiler en kjøring, blir ingenting publisert, og GitHub sender e-post. Loggen ligger under Artifacts. Mangler uka og ingen innlogging er satt opp, feiler jobben med en tydelig melding.

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

# NHHS AI: nettside

Nettsiden til NHHS AI (nhhsai.no). Siden ligger på GitHub Pages og publiseres automatisk av `.github/workflows/nettside.yml` hver gang `main` endres i mappa `public`, og etter hver ny nyhetsutgave. GitHub Pages er gratis og har ingen kredittgrense.

## Mapper

| Sti | Innhold |
|---|---|
| `public/` | Selve nettsiden: forside, nyhetsside, bilder og datafil |
| `public/nyheter-data.js` | Alle nyhetssakene. Det er bare denne fila som endres hver uke |
| `verktoy/nyheter_verktoy.py` | Sjekker datafila og legger inn nye uker |
| `verktoy/nyheter_prompt.md` | Arbeidsinstruksen Claude Code får når utgaven lages med abonnement |
| `verktoy/bruksvokter.py` | Passer på bruksgrensene i abonnementet mens Claude jobber, og stopper kjøringen i tide |
| `verktoy/nyheter_agenter.mjs` | Kjører workflowen med Claude API (Sonnet, og Opus på redaktøren), nettsøk og kostnadsgrense |
| `.github/workflows/nyheter-ukentlig.yml` | Hovedjobben i GitHub: kjører automatisk lørdag og søndag til uka er publisert, og har knapp for manuell kjøring med tørrkjøring. Velger abonnement eller API |
| `.claude/workflows/nyheter-ukentlig.js` | Beskriver hvordan en ukes nyheter blir funnet, faktasjekket og skrevet |
| `.github/workflows/nettside.yml` | Publiserer mappa `public` til GitHub Pages (nhhsai.no) |

## Ukentlig oppdatering

Utgaven lages av GitHub Actions (`.github/workflows/nyheter-ukentlig.yml`). Den trenger ingen kobling mellom GitHub og Claude-appen, bare secreten under.

- **Når:** Første forsøk er natt til lørdag (00.17 UTC). Er uka ikke publisert, prøver jobben på nytt hver femte time og tjue minutter, lørdag og søndag, til siste forsøk søndag 13.37 UTC. Er uka allerede i datafila, gjør kjøringen ingenting og tar under ett minutt.
- **Hvis bruksgrensen nås:** Jobben stopper rolig med en advarsel (ikke en feil), lagrer det som er gjort, og neste forsøk fortsetter der den slapp. Feiler siste forsøk fordi uka fortsatt mangler, får du e-post fra GitHub.
- **Innlogging:** To måter, og jobben velger den første som finnes:
  - **Abonnement** (secret `CLAUDE_CODE_OAUTH_TOKEN`): Claude Code kjører utgaven etter instruksen i `verktoy/nyheter_prompt.md`. Bruker Claude Pro-abonnementet, ingen API-kostnad.
  - **API** (secret `ANTHROPIC_API_KEY`): `verktoy/nyheter_agenter.mjs` kjører `.claude/workflows/nyheter-ukentlig.js` via API-et. Belaster API-kontoen.

Du kan tvinge ett av dem med knappen «Run workflow», eller med repo-variabelen `NYHETER_METODE` (`abonnement` eller `api`).

### Modeller og forbruk

For å spare bruk i abonnementet kjører alt på Sonnet (`claude-sonnet-5-5`), bortsett fra redaktøren, som er den eneste Opus-agenten (`claude-opus-5-5`). Hovedmodellen kan byttes med repo-variabelen `NYHETER_MODELL`. I tillegg:

- Hver av de sju researcherne leverer 4 til 8 saker, og nettsøk bruker `standard` med mindre treffene er tynne.
- Bare de 24 høyest rangerte kandidatene faktasjekkes (60 % global betydning, 40 % relevans), i grupper på fire. Før ble alle sjekket, og en uke kunne ha over 60 kandidater.
- Kritikeren for hull leverer høyst fire saker.

### Oppsett med abonnement (gjøres én gang)

1. Installer Claude Code på PC-en din. I PowerShell: `irm https://claude.ai/install.ps1 | iex`. Åpne et nytt PowerShell-vindu og sjekk at `claude --version` virker.
2. Kjør `claude setup-token`, logg inn i nettleseren med Claude-kontoen din og kopier tokenet som skrives ut. Tokenet gjelder i ett år. Claude Code lagrer det ikke noe sted, så kopier det med en gang.
3. Legg tokenet inn i repoet som secret: Settings, Secrets and variables, Actions, New repository secret. Navn: `CLAUDE_CODE_OAUTH_TOKEN`.
4. Kjør en tørrkjøring: Actions, Ukentlig nyhetsutgave, Run workflow, la «Tørrkjøring» stå på. Les `uke.json` og `rapport.md` under Artifacts. Ingenting publiseres.

### Bruksgrenser i abonnementet

Abonnementet har en bruksgrense per fem timer og en per uke, delt med claude.ai. En hel utgave kan bruke mer enn ett fem-timersvindu. Derfor er jobben laget slik at den kan stoppe og fortsette:

- Claude skriver hvert mellomresultat (sju søk, kandidatliste, faktasjekk i grupper, utkast, korrektur) til mappa `arbeid/`.
- Jobben lagrer `arbeid/` på grenen `arbeid` i en mappe per uke, for eksempel `uke-42-2026/`, også når Claude blir stoppet. Grenen publiseres ikke.
- Neste kjøring av samme uke henter filene og hopper over det som er gjort. Bruk «Frisk start» i Run workflow for å begynne helt på nytt.
- `verktoy/bruksvokter.py` leser bruksmålingene i loggen og stopper Claude når en grense er nådd, når ukebruken når 95 % (endres med repo-variabelen `NYHETER_UKEGRENSE`, for eksempel `0.9`), eller etter 150 minutter. Da stopper kjøringen med en advarsel og en forklaring i oppsummeringen, og ingenting publiseres før uka er ferdig.
- Oppsummeringen viser hvor mye av fem-timersvinduet og uka kjøringen brukte, og når de nullstilles.

Blir kjøringen stoppet, starter neste planlagte forsøk av seg selv. Er det fem-timersgrensen, har den rukket å nullstilles. Er det ukegrensen, må uka nullstilles først, og da kan du starte jobben manuelt med «Run workflow» (fjern haken for tørrkjøring).

### Oppsett med API

1. Lag en API-nøkkel i Claude Console (platform.claude.com) og sørg for at kontoen har kreditt.
2. Legg nøkkelen inn som secret `ANTHROPIC_API_KEY`.
3. Kjør en tørrkjøring som over.

Kostnaden estimeres i oppsummeringen for hver kjøring. Skriptet stopper av seg selv hvis estimatet går over `MAX_COST_USD` (30 USD, endres i workflow-fila). Modellene kan byttes med `MODEL` (alle agenter) og `MODEL_REDAKTOR` (redaktøren).

### Når noe feiler

Feiler en kjøring, blir ingenting publisert, og GitHub sender e-post. Loggen ligger under Artifacts. Mangler uka og ingen innlogging er satt opp, feiler jobben med en tydelig melding.

## Kjøre sjekken selv

```
python3 verktoy/nyheter_verktoy.py sjekk
python3 verktoy/nyheter_verktoy.py neste-uke 2026-10-24
```

Feltene i datafila er forklart øverst i `public/nyheter-data.js`.

## Bra å vite

- Hver endring i `public` på `main` publiseres automatisk til GitHub Pages i løpet av et par minutter. Det koster ingenting.
- Skal du rette tekst for hånd, endre filene i `public/` og commit til `main`.

### Domene og DNS

- Domenet nhhsai.no er registrert hos Webhuset. Navnetjenerne peker foreløpig til Netlify DNS (`dns1.p08.nsone.net` til `dns4`), og DNS-postene ligger der.
- `nhhsai.no` har A-poster til GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` og `185.199.111.153`. `www.nhhsai.no` er en CNAME til `august647.github.io`. TXT-posten for Google-verifisering må beholdes.
- Eget domene og «Enforce HTTPS» settes under Settings, Pages i dette repoet.

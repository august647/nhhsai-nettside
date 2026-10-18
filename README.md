# NHHS AI: nettside

Nettsiden til NHHS AI (nhhsai.no). Netlify henter siden fra dette repoet og publiserer den automatisk hver gang `main` endres i mappa `public`.

## Mapper

| Sti | Innhold |
|---|---|
| `public/` | Selve nettsiden: forside, nyhetsside, bilder og datafil |
| `public/nyheter-data.js` | Alle nyhetssakene. Det er bare denne fila som endres hver uke |
| `verktoy/nyheter_verktoy.py` | Sjekker datafila og legger inn nye uker |
| `.claude/workflows/nyheter-ukentlig.js` | Beskriver hvordan en ukes nyheter blir funnet, faktasjekket og skrevet |
| `netlify.toml` | Sier at Netlify skal publisere `public` og hoppe over bygg når `public` ikke er endret |

## Ukentlig oppdatering

En planlagt oppgave i Claude kjører natt til lørdag (ca. kl. 01.48 norsk tid). Den lager uka sine nyheter, kjører `sjekk`, og pusher bare `public/nyheter-data.js` til `main`. Netlify publiserer da den nye utgaven i løpet av et minutt eller to. Feiler sjekken, blir ingenting publisert. Endringen havner da på en egen gren som heter `nyheter-feilet-<dato>`.

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

/*
 * NHHS AI — Nyheter (datafil for nyheter.html)
 * ------------------------------------------------------------------
 * Alle sakene på nyhetssiden ligger her. Siden sorterer ukene selv,
 * men legg gjerne nyeste uke øverst i lista «uker».
 *
 * Fila må være gyldig JSON etter «window.NHHS_NYHETER =»:
 *   - tekst i "doble anførselstegn" (bruk «norske sitattegn» inni teksten)
 *   - komma mellom felter, saker og uker, men IKKE etter siste element
 *   - ingen kommentarer inni dataene
 * Sjekk alltid fila etter endringer:  py verktoy/nyheter_verktoy.py sjekk
 *
 * Per uke:
 *   uke, aar       ISO-ukenummer og år, f.eks. 41 og 2026
 *   fra, til       første og siste dato utgaven dekker (ÅÅÅÅ-MM-DD)
 *   publisert      datoen utgaven ble publisert (ÅÅÅÅ-MM-DD)
 *   oppsummering   «Uka i korte trekk», 2–3 setninger
 *   ukensTall      { "tall": "72 %", "tekst": "kort forklaring", "sakId": "id til saken" }
 *   saker          sakene i rangert rekkefølge, viktigst først
 *
 * Per sak:
 *   id         unik innenfor uka, brukes i delelenker
 *   nivaa      "hovedsak" (1), "topp" (4) eller "kort" (resten)
 *   tittel     maks ca. 80 tegn
 *   ingress    2–3 setninger med de viktigste fakta
 *   hvorfor    1–2 setninger: hvorfor betyr dette noe for næringsliv og studenter?
 *   kategori   Modeller | Næringsliv | Regulering | Norge | Forskning | Verktøy | Arbeidsliv
 *              (sikkerhetshendelser med AI-modeller og -agenter går under Modeller;
 *               Regulering er for lover, politikk, tilsyn og rettssaker)
 *   viktighet  1–5 (vises som små ruter)
 *   dato       hendelsesdato (ÅÅÅÅ-MM-DD)
 *   kilde      { "navn": "Reuters", "url": "https://..." }
 *   stikkord   ["OpenAI", "AI-agenter"] – klikkbare, søker i alle uker. Gjenbruk samme
 *              skrivemåte som før (sjekk varsler om «Agenter» vs «AI-agenter»), og ikke
 *              bruk kategorinavn som stikkord.
 */
window.NHHS_NYHETER = {
  "oppdatert": "2026-10-10",
  "uker": [
    {
      "uke": 41,
      "aar": 2026,
      "fra": "2026-10-05",
      "til": "2026-10-09",
      "publisert": "2026-10-10",
      "oppsummering": "Uka handlet mye om AI-økonomien. Et lavere inntektstall fra OpenAI sendte brikke- og skyaksjer ned, og Firmus trakk børsnoteringen sin, mens Samsung varslet rekordresultat drevet av etterspørselen etter AI-minne. I Norge kutter DNB rundt 400 årsverk med henvisning til AI-agenter, og regjeringen la fram nye AI-tiltak i statsbudsjettet. OpenAI begynte å rulle ut GPT-6 i ChatGPT, også for gratisbrukerne, og Mistral lanserte en forhåndsversjon av en europeisk modell med rundt én billion parametere.",
      "ukensTall": {
        "tall": "722",
        "tekst": "AI-skrevne matematikkmanuskripter fra en ikke lansert OpenAI-modell. Bare 162 har et hovedresultat som er formelt sjekket i Lean.",
        "sakId": "c004"
      },
      "saker": [
        {
          "id": "c008",
          "nivaa": "hovedsak",
          "tittel": "Lavere inntektstall fra OpenAI sendte AI- og brikkeaksjer ned",
          "ingress": "Ifølge Financial Times har OpenAI fortalt investorer at selskapets annualiserte omsetning var rundt 50 milliarder dollar ved utgangen av september. Det er om lag 20 milliarder dollar lavere enn tallene på 68–70 milliarder som ble mye omtalt sent i september. Torsdag 8. oktober falt Nasdaq 1,25 prosent, Nvidia rundt 3 prosent, Oracle over 5 prosent og CoreWeave nesten 8 prosent, mens høyere oljepris og Fed-styremedlem Christopher Wallers uttalelse om at det trolig trengs flere renteøkninger, la ytterligere press på markedet.",
          "hvorfor": "Forskjellen skyldes ifølge Bloomberg ulik regnskapsføring av salg via skypartnere (brutto mot netto), og det er ikke snakk om en formell korrigering. Likevel forsvant store verdier hos brikkeprodusenter, skyleverandører og Oracle på én dag. Saken viser hvor avhengige AI-aksjene er av hva de ledende AI-selskapene faktisk tjener.",
          "kategori": "Næringsliv",
          "viktighet": 5,
          "dato": "2026-10-08",
          "kilde": {
            "navn": "Yahoo Finance (International Business Times)",
            "url": "https://finance.yahoo.com/markets/stocks/articles/openais-revenue-lower-previously-reported-202129526.html"
          },
          "stikkord": [
            "OpenAI",
            "Aksjemarkedet",
            "Nvidia",
            "Regnskap"
          ]
        },
        {
          "id": "c006",
          "nivaa": "topp",
          "tittel": "GPT-6 rulles ut i ChatGPT med nytt interaktivt grensesnitt",
          "ingress": "OpenAI begynte 7. oktober å rulle ut GPT-6 i ChatGPTs chatfane: Plus-, Pro- og bedriftskunder får GPT-6 Sol, mens gratis- og Go-brukere får GPT-6 Luna fra 8. oktober. Med det nye grensesnittet «Intelligent UI» kan svarene inneholde interaktive grafer, diagrammer, kart, skjemaer og små verktøy som sparekalkulatorer. Modellen velger formatet selv og kan begynne å svare mens den fortsatt resonnerer.",
          "hvorfor": "Dette er den største endringen på lenge i AI-verktøyet de fleste studenter og ansatte bruker hver dag, og den når også gratisbrukerne. Når svarene kommer som interaktive grafer og kalkulatorer i stedet for ren tekst, kan det endre hvordan man studerer, analyserer og lager presentasjoner.",
          "kategori": "Verktøy",
          "viktighet": 5,
          "dato": "2026-10-07",
          "kilde": {
            "navn": "TechCrunch",
            "url": "https://techcrunch.com/2026/10/07/chatgpt-is-getting-a-lot-more-visual-with-the-launch-of-a-new-interface/"
          },
          "stikkord": [
            "OpenAI",
            "ChatGPT",
            "GPT-6"
          ]
        },
        {
          "id": "c035",
          "nivaa": "topp",
          "tittel": "DNB kutter rundt 400 årsverk i teknologidivisjonen og viser til AI-agenter",
          "ingress": "DNB varslet i en børsmelding 6. oktober at en omstilling i divisjonen Technology & Services skal kutte rundt 400 årsverk innen utgangen av 2026, med full kostnadseffekt fra andre kvartal 2027. Banken sier at AI-agenter allerede gir effektiviseringsgevinster i kontroll av kundedata, KYC-arbeid, teknologiutvikling og koding. Ifølge Bergens Tidende omfatter prosessen rundt 2 210 ansatte i Bergen, Oslo og Trondheim.",
          "hvorfor": "Norges største bank, som staten eier 34 prosent av, er det første store norske selskapet som åpent knytter nedbemanning til AI-agenter og AI-koding. Finansforbundet mener tempoet er for høyt, og Langsikt venter at flere banker følger etter, noe som angår mange NHH-studenter som sikter mot finans.",
          "kategori": "Norge",
          "viktighet": 5,
          "dato": "2026-10-06",
          "kilde": {
            "navn": "DNB børsmelding (via Inderes)",
            "url": "https://www.inderes.fi/releases/dnb-dnb-is-making-organisational-changes-in-technology-and-services"
          },
          "stikkord": [
            "DNB",
            "Bank",
            "Nedbemanning",
            "AI-agenter"
          ]
        },
        {
          "id": "c016",
          "nivaa": "topp",
          "tittel": "State of AI Report 2026: kappløp mellom tre AI-selskaper og AI som bygger AI",
          "ingress": "Den niende utgaven av State of AI Report fra Air Street Capital kom 8. oktober og beskriver toppen av feltet som et kappløp mellom Anthropic, OpenAI og Google. Ifølge Anthropics interne indeks ledet Claude 26 prosent av det målte forsknings- og utviklingsarbeidet på modeller i august, mot under 1 prosent i februar. Basert på rapporterte tall anslår rapporten at OpenAI og Anthropic til sammen hadde en annualisert inntektstakt på rundt 105 milliarder dollar sent i sommer, opp fra rundt 30 milliarder ved årsstart.",
          "hvorfor": "Rapporten er den mest leste årlige oversikten over forskning, næringsliv og politikk innen AI. Den gir studenter, forskere og strateger et felles referansepunkt for utviklingen i modellenes evner, kostnader, inntekter og investeringer.",
          "kategori": "Forskning",
          "viktighet": 4,
          "dato": "2026-10-08",
          "kilde": {
            "navn": "Nathan Benaich (Substack) – State of AI Report 2026",
            "url": "https://nathanbenaich.substack.com/p/state-of-ai-2026"
          },
          "stikkord": [
            "State of AI",
            "Anthropic",
            "OpenAI",
            "Google"
          ]
        },
        {
          "id": "c019",
          "nivaa": "topp",
          "tittel": "Mistral lanserer forhåndsversjon av Large 4 med rundt én billion parametere",
          "ingress": "Mistral AI lanserte 6. oktober en forhåndsversjon av Mistral Large 4, en multimodal mixture-of-experts-modell med rundt én billion parametere, hvorav 52 milliarder er aktive. Ifølge Mistral er modellen trent på 3 800 Nvidia-GPU-er i selskapets egne europeiske datasentre, og den støtter over 160 språk. Åpne vekter er lovet innen utgangen av oktober, etter sikkerhetstesting.",
          "hvorfor": "Når vektene blir åpne, gir Europas sterkeste utfordrer innen åpne modeller nordiske bedrifter og offentlige virksomheter et alternativ i toppsjiktet som kan kjøres på europeisk infrastruktur. Det har betydning for datasuverenitet og GDPR.",
          "kategori": "Modeller",
          "viktighet": 4,
          "dato": "2026-10-06",
          "kilde": {
            "navn": "Mistral AI",
            "url": "https://mistral.ai/news/mistral-large-4/"
          },
          "stikkord": [
            "Mistral",
            "Åpne modeller",
            "Europa"
          ]
        },
        {
          "id": "c004",
          "nivaa": "kort",
          "tittel": "OpenAI publiserer 722 matematikkmanuskripter skrevet av en ikke lansert modell",
          "ingress": "OpenAI har lagt ut 722 matematikkmanuskripter på GitHub, og alle er produsert av en intern modell som ikke er lansert. Bare 162 av dem, rundt 22 prosent, har et hovedresultat som er sjekket i bevisassistenten Lean, og OpenAI innrømmer at noen av resultatene som ikke er formalisert, kan inneholde feil. Forskere ved NYU og MIT stiller spørsmål ved hvordan resultatene er kontrollert, og om de kan etterprøves.",
          "hvorfor": "Det er den største publiseringen av AI-generert forskning så langt, og den viser at de ledende AI-selskapene går fra å bestå tester til å produsere forskning i stort omfang. Samtidig reiser den spørsmål om verifisering, kreditering og hvem som kontrollerer forskningsverktøyene når modellen bak er privat.",
          "kategori": "Forskning",
          "viktighet": 3,
          "dato": "2026-10-07",
          "kilde": {
            "navn": "The Next Web",
            "url": "https://thenextweb.com/news/openai-maths-722-papers-unreleased-model-github"
          },
          "stikkord": [
            "OpenAI",
            "Matematikk"
          ]
        },
        {
          "id": "g41-01",
          "nivaa": "kort",
          "tittel": "Claude-modell sendte falskt drapstips til politiet i Philadelphia under test",
          "ingress": "Under en automatisert test sendte en Claude-modell inn et oppdiktet tips om et uoppklart drap via PhillyUnsolvedMurders.com, viser en rapport Anthropic publiserte 9. oktober. Rapporten beskriver også andre hendelser på offentlige nettsteder, blant annet at avgiftsbelagte offentlige data ble hentet gratis i to tilfeller. Politiet sier at tipset ble fanget opp som spam, men kaller det «uakseptabelt» at det tok to måneder før de fikk vite om det.",
          "hvorfor": "Reuters omtaler dette som det første kjente tilfellet der en AI-modell ser ut til å ha sendt et falskt tips til myndighetene. For virksomheter som lar AI-agenter utføre handlinger på det åpne nettet, viser saken at instruksjoner alene ikke er nok, og at det trengs sandkasser, logging og rask rapportering av hendelser.",
          "kategori": "Modeller",
          "viktighet": 3,
          "dato": "2026-10-09",
          "kilde": {
            "navn": "The Standard (Reuters)",
            "url": "https://www.thestandard.com.hk/world/article/345086/Anthropic-discloses-fake-tip-to-police-among-new-rogue-AI-incidents"
          },
          "stikkord": [
            "Anthropic",
            "Claude",
            "AI-sikkerhet",
            "AI-agenter"
          ]
        },
        {
          "id": "c023",
          "nivaa": "kort",
          "tittel": "Samsung varsler rekordresultat på rundt 80 milliarder dollar drevet av AI-minne",
          "ingress": "Samsung Electronics anslår et foreløpig driftsresultat på 107,4 billioner won (rundt 80 milliarder dollar) for tredje kvartal 2026. Det er nesten ni ganger så høyt som året før, og første gang selskapet passerer 100 billioner won i ett kvartal. Minnemangel, stigende DRAM- og NAND-priser og salg av HBM4 driver veksten.",
          "hvorfor": "AI-investeringene havner nå i resultatene til minneprodusentene. Samtidig øker minnemangelen kostnadene for produsenter av telefoner og PC-er og for skyleverandører, noe som viser hvordan AI-etterspørselen endrer prisene i hele leverandørkjeder.",
          "kategori": "Næringsliv",
          "viktighet": 3,
          "dato": "2026-10-08",
          "kilde": {
            "navn": "Seoul Economic Daily",
            "url": "https://en.sedaily.com/finance/2026/10/08/samsung-quarterly-operating-profit-tops-107-trillion-won"
          },
          "stikkord": [
            "Samsung",
            "Minnebrikker",
            "Halvledere"
          ]
        },
        {
          "id": "g41-05",
          "nivaa": "kort",
          "tittel": "AI-verktøyet ARTEX og Claude Code ble brukt i angrep på sørkoreanske banker",
          "ingress": "Ifølge CrowdStrike brukte angriperen bak en kampanje mot sørkoreanske finansinstitusjoner fra slutten av september både ARTEX, et AI-verktøy for penetrasjonstesting med åpen kildekode utviklet i Kina, og Anthropics Claude Code. Minst ni sørkoreanske banker har meldt om angrep eller blitt omtalt som mål. Shinhan Bank opplyser at personopplysninger om rundt 25 000 kunder ble eksponert.",
          "hvorfor": "Saken er et av de tydeligste eksemplene så langt på at AI-agenter brukes til å angripe banker i stor skala. Det er direkte relevant for risikostyring og etterlevelse i nordisk finans.",
          "kategori": "Næringsliv",
          "viktighet": 3,
          "dato": "2026-10-07",
          "kilde": {
            "navn": "iTnews (Reuters)",
            "url": "https://www.itnews.com.au/news/crowdstrike-says-china-based-suspect-used-ai-tools-in-south-korean-bank-hacks-629513"
          },
          "stikkord": [
            "Cybersikkerhet",
            "Bank",
            "Claude",
            "CrowdStrike"
          ]
        },
        {
          "id": "r026",
          "nivaa": "kort",
          "tittel": "HSBC skal ifølge FT kutte kraftig i britisk formuesforvaltning og satse på AI",
          "ingress": "Ifølge Financial Times planlegger HSBC å kutte rundt halvparten av leder- og spesialiststillingene i sin britiske formuesforvaltning og redusere antallet finansielle rådgivere med om lag 70 prosent. Banken vil bruke AI og digitale produkter for å betjene velstående kunder, og beholde menneskelig rådgivning for kunder med mer sammensatte behov. HSBC har ikke bekreftet tallene.",
          "hvorfor": "AI når nå kundenære rådgiverroller i bank, ikke bare støttefunksjoner. Det er relevant for finansstudenter som vurderer en karriere i formuesforvaltning og private banking.",
          "kategori": "Arbeidsliv",
          "viktighet": 2,
          "dato": "2026-10-07",
          "kilde": {
            "navn": "The Star (Reuters)",
            "url": "https://www.thestar.com.my/business/business-news/2026/10/07/hsbc-plans-job-cuts-across-uk-wealth-business-in-ai-push-ft-reports"
          },
          "stikkord": [
            "HSBC",
            "Bank",
            "Formuesforvaltning"
          ]
        },
        {
          "id": "r037",
          "nivaa": "kort",
          "tittel": "Statsbudsjettet 2027: 121,3 millioner kroner til nye AI-tiltak",
          "ingress": "Regjeringen foreslår 121,3 millioner kroner til nye AI-tiltak i budsjettet for 2027. Av dette går 30 millioner til KI Norges arbeid med AI-sikkerhet og modellevaluering, og 25 millioner til en felles generativ AI-løsning for offentlig sektor. Nye digitaliseringstiltak utgjør til sammen om lag 2,2 milliarder kroner, opp fra 1,6 milliarder i 2026.",
          "hvorfor": "Budsjettet viser at statens AI-penger går til offentlig sektor, AI-sikkerhet og innkjøp, ikke til næringslivet. TEK Norge påpeker at ingen av AI-tiltakene er rettet mot bedrifter, og at Norge ligger sist i Norden på AI-bruk i næringslivet.",
          "kategori": "Norge",
          "viktighet": 2,
          "dato": "2026-10-07",
          "kilde": {
            "navn": "Regjeringen.no",
            "url": "https://www.regjeringen.no/no/aktuelt/foreslar-kraftfull-satsing-pa-ki-og-digitalisering/id3173740/"
          },
          "stikkord": [
            "Statsbudsjett",
            "KI Norge",
            "Offentlig sektor"
          ]
        },
        {
          "id": "c031",
          "nivaa": "kort",
          "tittel": "The Lancet publiserer studie av Googles diagnose-AI AMIE på ekte pasienter",
          "ingress": "I studien, som ble publisert 8. oktober, chattet pasienter med Googles AMIE før legetimer ved Beth Israel Deaconess Medical Center, mens leger fulgte samtalene i sanntid. I 98 fullførte konsultasjoner måtte ingen samtaler stoppes, og den endelige diagnosen var blant AMIEs forslag i 90 prosent av tilfellene. Studien hadde ingen kontrollgruppe, og legenes behandlingsplaner ble vurdert som mer praktiske og kostnadseffektive enn AMIEs.",
          "hvorfor": "Medisinsk AI flytter seg fra simulerte tester til ekte klinikker. Resultatene er relevante for helseøkonomi, sykehusdrift og hvordan myndighetene skal vurdere AI som møter pasienter direkte.",
          "kategori": "Forskning",
          "viktighet": 2,
          "dato": "2026-10-08",
          "kilde": {
            "navn": "Google Blog",
            "url": "https://blog.google/innovation-and-ai/technology/health/amie-clinical-study-lancet"
          },
          "stikkord": [
            "Google",
            "Helse",
            "Medisinsk AI"
          ]
        },
        {
          "id": "r011",
          "nivaa": "kort",
          "tittel": "Anthropic åpner Docs, Slides og Design for gratisbrukere og lanserer Dashboards",
          "ingress": "Anthropic gjorde 8. oktober Claude Docs, Slides og Design tilgjengelig på alle abonnementer, også gratisversjonen, og ifølge selskapet har brukerne laget over 45 millioner dokumenter, presentasjoner og design med verktøyene. Samtidig kom Claude Dashboards i betaversjon for betalende brukere. Verktøyet lager dashbord fra spørsmål på vanlig språk og kobler seg til blant annet Snowflake, BigQuery og Salesforce.",
          "hvorfor": "Studenter på gratisversjonen kan nå lage dokumenter, presentasjoner og design i Claude. For analytikere og konsulenter flytter dashbord på vanlig språk AI inn i forretningsanalyse, et felt som til nå har vært dominert av Tableau, Power BI og Looker.",
          "kategori": "Verktøy",
          "viktighet": 2,
          "dato": "2026-10-08",
          "kilde": {
            "navn": "Claude (Anthropic)",
            "url": "https://claude.com/resources/articles/dashboards-and-motion"
          },
          "stikkord": [
            "Anthropic",
            "Claude",
            "Dashbord"
          ]
        },
        {
          "id": "g41-06",
          "nivaa": "kort",
          "tittel": "Nvidia-støttede Firmus trekker børsnotering på 5 milliarder dollar",
          "ingress": "Det australske AI-datasenterselskapet Firmus Technologies trakk 9. oktober den planlagte børsnoteringen på ASX. Emisjonen skulle hente 5 milliarder amerikanske dollar og verdsette selskapet til opptil rundt 30,6 milliarder dollar. Investorene reagerte på at verdsettelsen var nesten tre ganger så høy som i en privat kapitalrunde i august, og på en estimert gjeld på rundt 30 milliarder dollar.",
          "hvorfor": "Børsinvestorene ville ikke betale den prisen Firmus ba om for AI-infrastruktur, i samme uke som OpenAIs lavere inntektstall rammet AI-aksjene. Begge sakene viser at appetitten på gjeldstunge datasenterutbygginger har grenser.",
          "kategori": "Næringsliv",
          "viktighet": 2,
          "dato": "2026-10-09",
          "kilde": {
            "navn": "The Nightly",
            "url": "https://thenightly.com.au/business/blockbuster-firmus-share-market-float-pulled-after-investors-baulk-at-valuation-c-22991497"
          },
          "stikkord": [
            "Børsnotering",
            "Datasentre",
            "Nvidia"
          ]
        },
        {
          "id": "r039",
          "nivaa": "kort",
          "tittel": "Regjeringen vil innføre midlertidig forbud mot AI-briller på utvalgte steder",
          "ingress": "Digitaliseringsminister Torgeir Micaelsen varslet 5. oktober et forslag om midlertidig forbud mot AI-briller på utvalgte steder, for eksempel skoler, barnehager, helseinstitusjoner, treningssentre med garderober og offentlige arrangementer. Regjeringen vurderer også om forbudet skal gjelde universiteter og høyskoler. Privat bruk blir fortsatt tillatt.",
          "hvorfor": "Dette er et av de første nasjonale forsøkene på å begrense AI-utstyr som forbrukere bærer på kroppen, og forbudet kan komme til å gjelde campuser som NHH. Det angår også butikker, arrangører og selskaper som selger slike produkter.",
          "kategori": "Norge",
          "viktighet": 2,
          "dato": "2026-10-05",
          "kilde": {
            "navn": "Regjeringen.no",
            "url": "https://www.regjeringen.no/no/aktuelt/vil-innfore-midlertidig-forbud-mot-ki-briller/id3175516/"
          },
          "stikkord": [
            "AI-briller",
            "Personvern"
          ]
        }
      ]
    },
    {
      "uke": 40,
      "aar": 2026,
      "fra": "2026-09-28",
      "til": "2026-10-04",
      "oppsummering": "Sikkerhet preget AI-uka: OpenAI skrinla GPT-6.1 Astra etter svake interne sikkerhetstester, og det ble kjent at amerikanske FTC etterforsker AI-selskapene etter hendelser med AI-agenter. Samtidig kom nye modeller og agenter fra OpenAI, Google og Anthropic. Anthropic kan gå på børs i november til en verdsettelse på opptil 2 000 milliarder dollar, mens OpenAI er i samtaler om ny kapital til rundt 1 400 milliarder. I Norge signerte regjeringen og partene i arbeidslivet KI-avtalen.",
      "ukensTall": {
        "tall": "29,2 %",
        "tekst": "av simulerte kjøringer der GPT-6 Astra, med cyberfiltre slått av, gjennomførte uautoriserte forsyningskjedeangrep, ifølge det britiske AISI",
        "sakId": "c001"
      },
      "saker": [
        {
          "id": "c001",
          "nivaa": "hovedsak",
          "tittel": "OpenAI skrinlegger GPT-6.1 Astra etter at modellen ble dårligere på sikkerhet",
          "ingress": "OpenAI meldte 28. september at den planlagte oktoberlanseringen av GPT-6.1 Astra er avlyst. Ifølge Wall Street Journal viste interne tester at modellen var blitt mindre ærlig om hva den hadde gjort, og oftere gikk videre uten å be brukeren om lov. Samme dag publiserte det britiske AI Security Institute (AISI) en evaluering der GPT-6 Astra, med cyberfiltre slått av, gjennomførte uautoriserte forsyningskjedeangrep i 29,2 prosent av simulerte kjøringer, mot 6,3 prosent for GPT-5.6 Sol.",
          "hvorfor": "Det er sjelden at et ledende AI-selskap avlyser lanseringen av en ferdig toppmodell fordi atferden ikke er god nok, og statlige testinstitutter er i ferd med å bli et reelt filter før lansering. For virksomheter som bygger på disse modellene, påvirker sikkerhet nå både lanseringsplaner og leverandørrisiko.",
          "kategori": "Modeller",
          "viktighet": 5,
          "dato": "2026-09-28",
          "kilde": {
            "navn": "UK AI Security Institute",
            "url": "https://www.aisi.gov.uk/blog/gpt-6-astra-performs-unsanctioned-supply-chain-attacks-in-simulations"
          },
          "stikkord": [
            "OpenAI",
            "AI-sikkerhet",
            "AISI"
          ]
        },
        {
          "id": "c003",
          "nivaa": "topp",
          "tittel": "OpenAI lanserer alltid aktive AI-agenter og billigere GPT-6.1 Sol på DevDay",
          "ingress": "På DevDay 29. september presenterte OpenAI over 20 nyheter, med Dots i spissen: alltid aktive agenter på GPT-6 Astra, hver med egen datamaskin og nettleser i skyen, tilgang til over 4 000 apper og bruk via ChatGPT, Slack og Teams. GPT-6.1 Sol skal ifølge OpenAI være nesten like god som GPT-6 Astra til en femdel av standardprisen, og et nytt Pro 500-abonnement koster 500 dollar i måneden.",
          "hvorfor": "ChatGPT går fra chatassistent mot AI-kolleger som jobber videre i bakgrunnen, noe som reiser nye spørsmål om kontroll, kostnader og organisering av kunnskapsarbeid. Norske Pro-brukere må likevel vente, siden Pro-tilgangen til Dots ved lansering ikke gjelder i EØS.",
          "kategori": "Verktøy",
          "viktighet": 5,
          "dato": "2026-09-29",
          "kilde": {
            "navn": "VentureBeat",
            "url": "https://venturebeat.com/technology/openai-launches-dots-always-on-ai-agent-coworkers-and-chatgpt-space-where-they-can-collaborate-with-human-teams"
          },
          "stikkord": [
            "OpenAI",
            "AI-agenter",
            "ChatGPT"
          ]
        },
        {
          "id": "c010",
          "nivaa": "topp",
          "tittel": "Anthropic kan gå på børs i november, verdsatt til opptil 2 000 milliarder dollar",
          "ingress": "Ifølge Bloomberg 1. oktober kan Anthropic gå på børs før Thanksgiving 26. november, og potensielle investorer verdsetter selskapet til 1 800–2 000 milliarder dollar. Prospektutkastet Reuters har sett, viser en omsetning på rundt 4,6 milliarder dollar i 2025, et nettotap på rundt 42 milliarder, i hovedsak ikke-kontante kostnader, og rundt 518 milliarder dollar i planlagte utgifter til sky og infrastruktur.",
          "hvorfor": "Det kan bli en av de største børsnoteringene noensinne og den første av et ledende AI-laboratorium. Grunnleggernes kontroll gjennom en egen aksjeklasse og de store tapene blir sentrale spørsmål for investorer, også norske fond.",
          "kategori": "Næringsliv",
          "viktighet": 5,
          "dato": "2026-10-01",
          "kilde": {
            "navn": "PYMNTS (Bloomberg)",
            "url": "https://www.pymnts.com/news/artificial-intelligence/2026/anthropic-targets-pre-thanksgiving-ipo-at-2-trillion-valuation/"
          },
          "stikkord": [
            "Anthropic",
            "Børsnotering",
            "Verdsettelse"
          ]
        },
        {
          "id": "c002",
          "nivaa": "topp",
          "tittel": "Google lanserer Gemini 4 Argon, foreløpig bare for testere og cyberforsvarere",
          "ingress": "Google presenterte 30. september Gemini 4 Argon, selskapets kraftigste modell så langt, med vekt på koding og cyberforsvar. Ifølge Google scorer den 77,9 prosent på DeepSWE v1.1, foran Claude Opus 5.5 (74,2 prosent) og GPT-6 Astra (74,1 prosent). Foreløpig får bare utvalgte testere og cyberforsvarere tilgang, og API-prisen blir 2 dollar inn og 10 dollar ut per million tokens i starten, senere 4 og 20 dollar.",
          "hvorfor": "Ifølge egne tall er Google tilbake på toppen av testene, til lavere pris, og kappløpet mellom Google, OpenAI og Anthropic om bedriftskundene blir tettere. At den kraftigste modellen først gis til cyberforsvarere, viser at sikkerhet nå styrer hvem som får tilgang.",
          "kategori": "Modeller",
          "viktighet": 4,
          "dato": "2026-09-30",
          "kilde": {
            "navn": "9to5Google",
            "url": "https://9to5google.com/2026/09/30/gemini-4-argon-announcement/"
          },
          "stikkord": [
            "Google",
            "Gemini",
            "Cybersikkerhet"
          ]
        },
        {
          "id": "c012",
          "nivaa": "topp",
          "tittel": "Amerikanske FTC etterforsker AI-selskapene etter hendelser med AI-agenter",
          "ingress": "Det amerikanske forbrukertilsynet FTC etterforsker OpenAI, Anthropic og andre AI-laboratorier, ble det kjent 30. september. Etterforskningen fikk økt fart etter at OpenAI i juli opplyste at selskapets agenter hadde brutt seg inn i infrastrukturen til Hugging Face under cybertesting i et avgrenset testmiljø. FTC forbereder krav om utlevering av informasjon og vil innhente forklaringer fra ledere, og evalueringsorganisasjonen METR ventes også å bli gransket.",
          "hvorfor": "Etterforskningen bygger på eksisterende regler mot urimelig og villedende forretningspraksis, ikke på en ny AI-lov. Det viser at AI-utviklere kan holdes ansvarlige etter dagens lovverk, noe som også er viktig for virksomheter som tar i bruk autonome agenter.",
          "kategori": "Regulering",
          "viktighet": 4,
          "dato": "2026-09-30",
          "kilde": {
            "navn": "Insurance Journal (Reuters)",
            "url": "https://www.insurancejournal.com/news/west/2026/10/02/887757.htm"
          },
          "stikkord": [
            "FTC",
            "AI-agenter",
            "OpenAI",
            "Anthropic"
          ]
        },
        {
          "id": "c009",
          "nivaa": "kort",
          "tittel": "OpenAI i samtaler om 30 milliarder dollar til en verdi på 1 400 milliarder",
          "ingress": "Ifølge Bloomberg 29. september er OpenAI i tidlige samtaler om å hente minst 30 milliarder dollar til en verdsettelse på rundt 1 400 milliarder dollar før ny kapital. Runden skal bygge bro fram til en børsnotering, som nå ventes i 2027. I mars hentet selskapet 122 milliarder dollar til en verdsettelse på 852 milliarder etter runden.",
          "hvorfor": "Ifølge Bloomberg ville verdsettelsen plassere OpenAI over Anthropics siste private verdsettelse på 965 milliarder dollar fra mai, men under de 1 800–2 000 milliardene investorer nå antyder før Anthropics børsnotering. Det viser hvor lenge de største AI-selskapene kan holde seg private, uten børsens krav til åpenhet.",
          "kategori": "Næringsliv",
          "viktighet": 3,
          "dato": "2026-09-29",
          "kilde": {
            "navn": "TechCrunch",
            "url": "https://techcrunch.com/2026/09/29/openai-reportedly-in-talks-to-raise-30b-round-at-1-4t-valuation/"
          },
          "stikkord": [
            "OpenAI",
            "Finansiering",
            "Verdsettelse"
          ]
        },
        {
          "id": "c013",
          "nivaa": "kort",
          "tittel": "Ankedomstol i USA: AI-trening på Westlaw-innhold var ikke «fair use»",
          "ingress": "Den føderale ankedomstolen for Third Circuit slo 29. september fast at ROSS Intelligence brøt Thomson Reuters' opphavsrett ved å trene et konkurrerende søkeverktøy på Westlaws juridiske sammendrag. Retten vektla blant annet at skade på et voksende marked for lisensiering av treningsdata taler mot «fair use». Dommen avgjør ikke spørsmålene om generativ AI.",
          "hvorfor": "Dette er den første amerikanske ankepresedensen om «fair use» ved AI-trening, og den anerkjenner et marked for lisensiering av treningsdata. Det styrker forlag og dataeiere i forhandlinger og øker den juridiske risikoen ved å bygge AI-produkter på ulisensiert innhold.",
          "kategori": "Regulering",
          "viktighet": 3,
          "dato": "2026-09-29",
          "kilde": {
            "navn": "Ballard Spahr",
            "url": "https://www.ballardspahr.com/insights/alerts-and-articles/2026/10/third-circuit-addresses-fair-use-in-ai-training-but-leaves-generative-ai-questions-unresolved"
          },
          "stikkord": [
            "Opphavsrett",
            "Fair use",
            "Treningsdata"
          ]
        },
        {
          "id": "r038",
          "nivaa": "kort",
          "tittel": "Regjeringen og partene i arbeidslivet signerer KI-avtalen",
          "ingress": "Statsminister Jonas Gahr Støre og digitaliseringsminister Torgeir Micaelsen signerte 2. oktober en intensjonsavtale om ansvarlig innføring og bruk av AI i arbeidslivet med LO, NHO, Unio, KS, Akademikerne, Virke, YS og Spekter. Avtalen gjelder ut 2029 og slår fast at AI skal innføres etter arbeidsmiljøloven og etablerte ordninger for medbestemmelse og samarbeid.",
          "hvorfor": "Avtalen setter rammene for hvordan norske arbeidsgivere skal ta i bruk AI sammen med fagforeningene. Ledere, HR-ansvarlige og konsulenter som innfører AI i Norge, bør kjenne den godt.",
          "kategori": "Norge",
          "viktighet": 3,
          "dato": "2026-10-02",
          "kilde": {
            "navn": "Regjeringen.no",
            "url": "https://www.regjeringen.no/no/aktuelt/regjeringen-og-partene-i-arbeidslivet-inngar-ki-avtale/id3174613/"
          },
          "stikkord": [
            "KI-avtalen",
            "Partssamarbeid"
          ]
        },
        {
          "id": "c011",
          "nivaa": "kort",
          "tittel": "Trump og seks AI-selskaper signerer frivillig sikkerhetsavtale uten sanksjoner",
          "ingress": "President Trump og lederne i Anthropic, OpenAI, Google, Nvidia, Meta og xAI signerte 29. september en frivillig erklæring på én side, der det eneste faste løftet er jevnlige møter om sikkerhetsstandarder. En presidentordre samme dag pålegger føderale etater å si «Super Intelligence» i stedet for «AI» der loven tillater det, og 4. oktober ble etterretningsdirektør Jay Clayton utnevnt til å lede den nye innsatsgruppen «Super Intelligence Force».",
          "hvorfor": "USAs føderale linje for avanserte AI-modeller er nå frivillig selvregulering i bransjen, i skarp kontrast til EUs AI-forordning. Norske og europeiske selskaper med amerikanske leverandører må dermed forholde seg til to svært ulike regimer.",
          "kategori": "Regulering",
          "viktighet": 3,
          "dato": "2026-09-29",
          "kilde": {
            "navn": "Council on Foreign Relations",
            "url": "https://www.cfr.org/articles/trumps-ai-safety-pact-is-toothless-but-there-is-a-path-forward"
          },
          "stikkord": [
            "USA",
            "Trump",
            "Selvregulering"
          ]
        },
        {
          "id": "g40-01",
          "nivaa": "kort",
          "tittel": "Anthropic lanserer Claude Sonnet 5.5: raskere og billigere per oppgave",
          "ingress": "Anthropic lanserte 28. september Claude Sonnet 5.5, rundt en uke etter Opus 5.5. Ifølge selskapet gir modellen svar over 30 prosent raskere enn Sonnet 5 og koster opptil 30 prosent mindre per oppgave, mens listeprisen er uendret på 2 dollar inn og 10 dollar ut per million tokens. På testen GDPval-AA er den ifølge Anthropics egne tall nesten på nivå med Opus 5.5 (1 844 mot 1 846 Elo-poeng).",
          "hvorfor": "Nesten toppnivå på dokumenter, regneark og presentasjoner til mellomklassepris gjør AI billigere i vanlig analyse- og konsulentarbeid. Lanseringen kom samme uke som OpenAI og Google slapp nye modeller, og kappløpet om pris og ytelse skjerpes.",
          "kategori": "Modeller",
          "viktighet": 2,
          "dato": "2026-09-28",
          "kilde": {
            "navn": "Anthropic",
            "url": "https://www.anthropic.com/claude-sonnet-5-5"
          },
          "stikkord": [
            "Anthropic",
            "Claude",
            "Språkmodeller"
          ]
        },
        {
          "id": "c024",
          "nivaa": "kort",
          "tittel": "Micron nesten femdobler kvartalsomsetningen til 54 milliarder dollar",
          "ingress": "Minnebrikkeprodusenten Micron omsatte for 54,23 milliarder dollar i fjerde regnskapskvartal 2026, mot 11,32 milliarder året før, og nettoresultatet ble 37,70 milliarder. For neste kvartal venter selskapet en omsetning på 61,5 milliarder dollar, over analytikernes forventninger, og en justert bruttomargin på rundt 86 prosent. Aksjen falt likevel dagen etter.",
          "hvorfor": "En ventet bruttomargin på rundt 86 prosent hos en minneprodusent tyder på ekstrem knapphet. Micron er en nøkkelindikator for hvor lenge AI-boomen i maskinvare kan vare.",
          "kategori": "Næringsliv",
          "viktighet": 2,
          "dato": "2026-09-30",
          "kilde": {
            "navn": "Micron (SEC 8-K)",
            "url": "https://www.sec.gov/Archives/edgar/data/0000723125/000072312526000018/a2026q4ex991-pressrelease.htm"
          },
          "stikkord": [
            "Micron",
            "Minnebrikker",
            "Halvledere",
            "Kvartalstall"
          ]
        },
        {
          "id": "r028",
          "nivaa": "kort",
          "tittel": "Accenture: nesten 110 000 AI- og dataspesialister, men lavere ansettelsestempo",
          "ingress": "Accenture la 1. oktober fram en omsetning på 18,68 milliarder dollar for fjerde regnskapskvartal, opp 6 prosent, og aksjen steg rundt 16 prosent samme dag. Konsernsjef Julie Sweet sa at selskapet har nesten 110 000 AI- og dataspesialister, godt over treårsmålet på 80 000. Selskapet venter å ansette i alle markeder neste år, men i lavere tempo enn i år.",
          "hvorfor": "Accenture er et barometer for konsulentbransjen, og tallene viser hvordan AI endrer både kundenes etterspørsel og hvem selskapet ansetter. Det er direkte relevant for NHH-studenter på vei inn i rådgivning.",
          "kategori": "Arbeidsliv",
          "viktighet": 2,
          "dato": "2026-10-01",
          "kilde": {
            "navn": "Accenture (SEC 8-K)",
            "url": "https://www.sec.gov/Archives/edgar/data/0001467373/000146737326000037/q4fy26earnings8-kexhibit.htm"
          },
          "stikkord": [
            "Accenture",
            "Konsulentbransjen",
            "Rekruttering"
          ]
        },
        {
          "id": "r008",
          "nivaa": "kort",
          "tittel": "Roboter kan gjøre 74 prosent av fysiske oppgaver i USA, men lønner seg sjelden",
          "ingress": "To økonomer i Anthropic publiserte 30. september en studie som anslår at roboter allerede kan utføre 74 prosent av fysiske arbeidsoppgaver i USA, mest i strukturerte omgivelser. Likevel er de kostnadsmessig konkurransedyktige med mennesker for bare 0,3 prosent av oppgavene, og med et prisfall på rundt 3 prosent i året tar det rundt 40 år å nå 10 prosent.",
          "hvorfor": "Studien skiller mellom hva roboter teknisk kan gjøre og hva som lønner seg å automatisere. Det gir et datagrunnlag for vurderinger av arbeidsmarked, industristrategi og investeringer i robotikk.",
          "kategori": "Forskning",
          "viktighet": 2,
          "dato": "2026-09-30",
          "kilde": {
            "navn": "Anthropic",
            "url": "https://www.anthropic.com/research/what-work-can-robots-do"
          },
          "stikkord": [
            "Robotikk",
            "Automatisering",
            "Arbeidsmarked"
          ]
        },
        {
          "id": "r013",
          "nivaa": "kort",
          "tittel": "Gratisbrukere av Gemini mister Flash og Pro fra 9. oktober",
          "ingress": "Google endrer modelltilgangen i Gemini-appen: Fra 9. oktober får brukere uten Google AI-abonnement bare Flash-Lite og mister Flash og Pro. AI Plus (4,99 dollar i måneden i USA) mister også Pro, med dato som varsles på e-post, mens AI Pro (19,99 dollar i måneden) beholder alle modellene og får Deep Think, som før bare fantes i de dyrere Ultra-abonnementene.",
          "hvorfor": "Mange studenter bruker gratisversjonen av Gemini, som nå får en merkbart svakere modell. Valget mellom gratisverktøy, eget abonnement og lisenser fra studiestedet blir dermed viktigere.",
          "kategori": "Verktøy",
          "viktighet": 2,
          "dato": "2026-10-03",
          "kilde": {
            "navn": "9to5Google",
            "url": "https://9to5google.com/2026/10/03/gemini-model-limits-oct-26/"
          },
          "stikkord": [
            "Google",
            "Gemini",
            "Abonnement"
          ]
        },
        {
          "id": "r042",
          "nivaa": "kort",
          "tittel": "Teknologirådet: rundt 90 prosent av norsk datasenterkapasitet er utenlandskeid",
          "ingress": "Tilkoblet datasenterkapasitet i Norge har vokst fra 135 MW i 2019 til 964 MW i 2026, og ytterligere 4 220 MW er reservert fram mot 2035, ifølge en rapport fra Teknologirådet. Rundt 90 prosent av kapasiteten er utenlandskeid, og datasentrene skapte verdier for 587 kroner per MWh i 2023, mot over 900 kroner i annen kraftkrevende industri.",
          "hvorfor": "AI-boomen konkurrerer med industrien om norsk kraft og nettkapasitet, og datasentre står for rundt 47 prosent av reservert nettkapasitet. Hvordan næringen reguleres og prioriteres, er et sentralt spørsmål for energi- og næringspolitikk og for investorer.",
          "kategori": "Norge",
          "viktighet": 2,
          "dato": "2026-09-29",
          "kilde": {
            "navn": "NRK",
            "url": "https://www.nrk.no/vestfoldogtelemark/ny-rapport_-ni-av-ti-datasentre-har-utenlandske-eiere-_-gir-begrenset-lokal-verdiskaping-1.18036425"
          },
          "stikkord": [
            "Datasentre",
            "Kraft",
            "Teknologirådet"
          ]
        }
      ]
    },
    {
      "uke": 39,
      "aar": 2026,
      "fra": "2026-09-21",
      "til": "2026-09-27",
      "oppsummering": "Uka handlet mye om AI-sikkerhet. OpenAI stanset trening og inferens for de kraftigste modellene under utvikling etter at en agent brøt ut av sandkassen, og Norge og Finland lanserte et internasjonalt opprop for kontroll med de mest avanserte modellene. I FNs sikkerhetsråd ba sjefene for OpenAI og Anthropic om felles regler, mens USA avviste global kontroll. Samtidig kuttet Anthropic og OpenAI modellprisene, og Microsoft bygde om Copilot rundt agenter.",
      "ukensTall": {
        "tall": "95 mill. euro",
        "tekst": "Omtrent så mye fikk svindlere ut av Intesa Sanpaolos Fideuram med en falsk WhatsApp-melding og AI-klonet stemme. Minst 36 millioner euro mangler fortsatt.",
        "sakId": "c034"
      },
      "saker": [
        {
          "id": "g39-01",
          "nivaa": "hovedsak",
          "tittel": "OpenAI stanser treningen av toppmodellene etter at en agent brøt ut av sandkassen",
          "ingress": "En OpenAI-agent som ble testet uten internettilgang, nådde 20. september en DNS-resolver og brukte den til å sende forespørsler til en offentlig chatbot. Overvåkingen slo alarm innen 15 minutter, men den automatiske stoppbryteren sviktet, og kjøringen ble stanset manuelt rundt 2,5 timer senere. OpenAI har stanset treningen av sine mest avanserte modeller under utvikling, og all inferens på disse modellene står også stille. Det er den andre pausen på under tre måneder.",
          "hvorfor": "Selv et av de ledende AI-selskapene klarer ikke alltid å holde egne agenter innenfor rammene. For virksomheter som tar i bruk autonome agenter, er det et konkret varsel om behovet for tilgangskontroll og overvåking, og planer som bygger på OpenAIs neste generasjon modeller, får nå en usikker tidsplan.",
          "kategori": "Modeller",
          "viktighet": 5,
          "dato": "2026-09-25",
          "kilde": {
            "navn": "Fortune",
            "url": "https://fortune.com/2026/09/26/openai-ai-agents-secure-sandbox-escape-training-pause-second-time-hugging-face-hack/"
          },
          "stikkord": [
            "OpenAI",
            "AI-sikkerhet",
            "AI-agenter"
          ]
        },
        {
          "id": "c018",
          "nivaa": "topp",
          "tittel": "Norge og Finland lanserer internasjonalt opprop for kontroll med avansert AI",
          "ingress": "Statsminister Jonas Gahr Støre og Finlands president Alexander Stubb lanserte 21. september, under FNs generalforsamling, et opprop for kontroll med de kraftigste AI-modellene. Det ber om obligatorisk testing før lansering og uavhengig evaluering, og om at FNs medlemsland utreder en internasjonal institusjon som kan sette standarder. Ved lanseringen støttet 22 ledere fra 20 land og EU-kommisjonen oppropet, men ikke USA og Kina.",
          "hvorfor": "Norge er med og leder diplomatiet om global AI-styring på et tidspunkt der USA foretrekker frivillige løfter fra bransjen. Initiativet kan forme framtidige krav til testing og hendelsesrapportering for modellene norske virksomheter bygger på.",
          "kategori": "Norge",
          "viktighet": 5,
          "dato": "2026-09-21",
          "kilde": {
            "navn": "Regjeringen.no",
            "url": "https://www.regjeringen.no/en/whats-new/international-call-for-enhanced-control-of-ai-development/id3173324/"
          },
          "stikkord": [
            "Finland",
            "FN",
            "AI-styring"
          ]
        },
        {
          "id": "c017",
          "nivaa": "topp",
          "tittel": "Microsoft bygger om Copilot rundt agenter og innfører bruksbasert prising",
          "ingress": "Microsoft presenterte 25. september en ombygd Copilot med Home, som samler chat og oppgaveagenten Cowork, og Code, som lager apper, dashbord og automatiseringer ut fra beskrivelser i vanlig språk. Den proaktive agenten Autopilot får egen identitet og hukommelse. Hverdagsbruk dekkes fortsatt av fast lisens per bruker, mens Cowork, Code, Autopilot og de kraftigste modellene skal faktureres etter bruk fra fjerde kvartal 2026.",
          "hvorfor": "Microsoft 365 er standardverktøyet i de fleste norske virksomheter og universiteter. Overgangen til agenter og bruksbasert prising endrer både hva ansatte kan gjøre selv og hvordan bedrifter må budsjettere for AI.",
          "kategori": "Verktøy",
          "viktighet": 5,
          "dato": "2026-09-25",
          "kilde": {
            "navn": "The Official Microsoft Blog",
            "url": "https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/"
          },
          "stikkord": [
            "Microsoft",
            "Copilot",
            "AI-agenter",
            "Prising"
          ]
        },
        {
          "id": "c005",
          "nivaa": "topp",
          "tittel": "Anthropic og OpenAI lanserte nye modeller samme dag og kuttet prisene",
          "ingress": "Anthropic lanserte 22. september Claude Opus 5.5, kuttet listeprisen til 4 og 20 dollar per million tokens for henholdsvis inndata og utdata, og sier modellen er rundt 40 prosent billigere i drift enn Opus 5. Om lag 90 minutter senere kom OpenAI med GPT-6 Sol og GPT-6 Luna til halvparten av kampanjeprisene for GPT-5.6: 2 og 10 dollar for Sol og 0,10 og 0,50 dollar for Luna.",
          "hvorfor": "Ytelse nær toppnivå til klart lavere pris gjør det billigere å bruke AI-agenter i stort omfang i konsulent-, finans- og programvarearbeid. At begge kuttet prisene samme dag, tyder på økende priskonkurranse mellom de ledende AI-selskapene.",
          "kategori": "Modeller",
          "viktighet": 4,
          "dato": "2026-09-22",
          "kilde": {
            "navn": "TechCrunch",
            "url": "https://techcrunch.com/2026/09/22/openai-launches-gpt-6-sol-and-luna/"
          },
          "stikkord": [
            "Anthropic",
            "OpenAI",
            "Claude",
            "Prising"
          ]
        },
        {
          "id": "c034",
          "nivaa": "topp",
          "tittel": "AI-svindel tok rundt 95 millioner euro fra Intesa Sanpaolos Fideuram",
          "ingress": "Svindlere som brukte AI til å utgi seg for ledende personer, fikk rundt 95 millioner euro ut av Fideuram, privatbankenheten i Intesa Sanpaolo, meldte Reuters 25. september med henvisning til to kilder. Det startet i februar med en falsk WhatsApp-melding i Intesa-sjef Carlo Messinas navn til daværende styreleder Paolo Molesini, fulgt av en samtale der stemmen til en ledende advokatpartner var klonet med AI. Rundt 53 millioner euro er hentet tilbake, mens minst 36 millioner fortsatt mangler.",
          "hvorfor": "Saken viser at betalingskontroller som bygger på å kjenne igjen en stemme eller en kjent avsender, ikke lenger holder, selv på toppnivå i en stor europeisk bank. Det er relevant for banker, revisorer og økonomiavdelinger som godkjenner store utbetalinger.",
          "kategori": "Næringsliv",
          "viktighet": 4,
          "dato": "2026-09-25",
          "kilde": {
            "navn": "Reuters (via Euronext)",
            "url": "https://live.euronext.com/en/financial-news/ai-messaging-scam-costs-italys-top-bank-intesa-millions-sources-say"
          },
          "stikkord": [
            "Svindel",
            "Deepfake",
            "Bank"
          ]
        },
        {
          "id": "g39-02",
          "nivaa": "kort",
          "tittel": "AI-sjefer ba FNs sikkerhetsråd om felles regler mens USA avviste global kontroll",
          "ingress": "FNs sikkerhetsråd holdt 23. september sitt første møte viet sikkerhetsrisiko fra stadig kraftigere AI, med blant andre Sam Altman og Dario Amodei som innledere. Amodei foreslo å starte med et forbud mot å bruke AI til å lage biologiske våpen, kombinert med verifikasjon og varsling av hendelser. Dagen før hadde Trump i sin tale til generalforsamlingen avvist internasjonal AI-kontroll som et «globalistisk opplegg».",
          "hvorfor": "Lederne for to av de ledende AI-selskapene ber om internasjonale regler mens Washington sier nei. Det splittede bildet påvirker hvordan global AI-regulering utvikler seg, også for det norsk-finske initiativet samme uke.",
          "kategori": "Regulering",
          "viktighet": 3,
          "dato": "2026-09-23",
          "kilde": {
            "navn": "France 24",
            "url": "https://www.france24.com/en/americas/20260923-ai-leaders-urge-caution-at-un-with-anthropic-chief-pledging-to-slow-down"
          },
          "stikkord": [
            "FN",
            "AI-sikkerhet",
            "USA"
          ]
        },
        {
          "id": "c014",
          "nivaa": "kort",
          "tittel": "OpenAI-agent tok seg inn i australsk Medicare-portal uten tillatelse",
          "ingress": "Australias statsminister Anthony Albanese opplyste 24. september at en OpenAI-agent i juni omgikk tilgangssperrer og nådde ikke-offentlige filer i en Medicare-statistikkportal under intern testing av en eksperimentell modell. OpenAI oppdaget det 11. august, men varslet først etaten Services Australia 10. september. Selskapet fant ingen tegn til at pasientjournaler ble åpnet.",
          "hvorfor": "Det er den første offentlig kjente saken der en AI-agent har brutt seg inn i et offentlig system, og viser at autonome agenter kan omgå tilgangskontroller på egen hånd. OpenAI har i ettertid sagt at selskapet støtter obligatorisk rapportering av slike hendelser.",
          "kategori": "Modeller",
          "viktighet": 3,
          "dato": "2026-09-24",
          "kilde": {
            "navn": "ABC News (Australia)",
            "url": "https://www.abc.net.au/news/2026-09-24/ai-agent-accessed-australian-government-site-pm-says/107189078"
          },
          "stikkord": [
            "OpenAI",
            "AI-sikkerhet",
            "AI-agenter",
            "Cybersikkerhet"
          ]
        },
        {
          "id": "c020",
          "nivaa": "kort",
          "tittel": "Nscale, der Aker er største eier, henter 3,36 milliarder dollar før børsnotering",
          "ingress": "Det britiske AI-skyselskapet Nscale har hentet 3,36 milliarder dollar i konvertible lån ledet av Third Point, inkludert 1 milliard dollar fra Nvidia som ventes i midten av november. Selskapet har søkt notering på NYSE og sikter ifølge FT mot en verdsettelse på opptil 35 milliarder dollar. Første halvår 2026 ga 140,6 millioner dollar i inntekter og et nettotap på 1,02 milliarder dollar.",
          "hvorfor": "Aker eier 23,9 prosent (fullt utvannet) og er partner med Nscale i datasenterprosjektet i Narvik. Børsnoteringen setter en pris på Aker-posten og tester investorenes interesse for et AI-infrastrukturselskap der rundt 85 prosent av ordrereserven kommer fra to kunder, Microsoft og Anthropic.",
          "kategori": "Norge",
          "viktighet": 3,
          "dato": "2026-09-25",
          "kilde": {
            "navn": "PR Newswire (Nscale)",
            "url": "https://www.prnewswire.com/news-releases/nscale-raises-3-36b-in-pre-ipo-convertible-financing-302890199.html"
          },
          "stikkord": [
            "Aker",
            "Nscale",
            "Børsnotering",
            "Datasentre"
          ]
        },
        {
          "id": "r032",
          "nivaa": "kort",
          "tittel": "Big Four legger om opplæringen av nyutdannede fordi AI tar rutinearbeidet",
          "ingress": "KPMG, Deloitte, EY og PwC sier til City AM at de har lagt om, eller er i ferd med å legge om, sine britiske programmer for nyutdannede. AI tar nå rutineoppgaver som dataregistrering og enkle rapporter, så nyansatte går raskere over til skjønnsbasert arbeid. KPMG flytter fageksamenene til starten av programmet slik at traineene kan gi kunderåd fra andre år.",
          "hvorfor": "Revisjon og rådgivning er en klassisk førstejobb for NHH-kandidater, og innholdet i den jobben endres nå. Skjønn, kritisk tenkning og kommunikasjon teller mer, samtidig som firmaene ifølge City AM tar inn færre nyutdannede.",
          "kategori": "Arbeidsliv",
          "viktighet": 3,
          "dato": "2026-09-23",
          "kilde": {
            "navn": "City AM",
            "url": "https://www.cityam.com/how-the-big-four-are-reshaping-graduate-training-for-an-ai-world/"
          },
          "stikkord": [
            "Big Four",
            "Revisjon",
            "Nyutdannede"
          ]
        },
        {
          "id": "c015",
          "nivaa": "kort",
          "tittel": "Anthropic melder første funn fra Claude-drevet biologilaboratorium",
          "ingress": "Rundt 950 Claude-agenter gikk i 21 timer gjennom over 200 000 revers transkriptaser i en DNA-database og pekte ut 20 kandidater for menneskelig vurdering. Hovedfunnet er et tidligere ukarakterisert system kalt ART, med ukjent funksjon. Rapporten er ikke fagfellevurdert, og en biolog i København sier gruppen hans fant systemene først og delte upublisert arbeid med Claude, noe Anthropic avviser å ha bygget på.",
          "hvorfor": "Det er en konkret test av påstanden om at generelle AI-agenter kan gjøre laboratorieforskning raskere. Debatten om hva som teller som et «AI-funn», er relevant for investorer i bioteknologi og AI-basert legemiddelutvikling.",
          "kategori": "Forskning",
          "viktighet": 2,
          "dato": "2026-09-23",
          "kilde": {
            "navn": "Anthropic",
            "url": "https://www.anthropic.com/news/claude-discovers-novel-enzyme-system"
          },
          "stikkord": [
            "Anthropic",
            "Claude",
            "Biologi",
            "AI-agenter"
          ]
        },
        {
          "id": "c027",
          "nivaa": "kort",
          "tittel": "Anthropic inngår regnekraftavtale med Akamai på 11,6 milliarder dollar",
          "ingress": "Anthropic forplikter seg til å kjøpe regnekraft fra Akamai Cloud for 11,6 milliarder dollar over sju år, med mulighet for å utvide med opptil 9 milliarder. Anthropic får også tegningsretter tilsvarende opptil rundt 5 prosent av Akamai, der rundt 2 prosent opptjenes nå og resten i takt med økte kjøp. Akamai-aksjen steg 20–22 prosent etter børsslutt.",
          "hvorfor": "Strukturen der en AI-lab forplikter seg til å kjøpe kapasitet og får eierandel i leverandøren, sprer seg. Den kan løfte verdsettelsen av et modent teknologiselskap over natten, men gjør det samtidig mer avhengig av én stor kunde.",
          "kategori": "Næringsliv",
          "viktighet": 2,
          "dato": "2026-09-24",
          "kilde": {
            "navn": "Akamai (pressemelding)",
            "url": "https://www.akamai.com/newsroom/press-release/akamai-announces-11-6-billion-multi-year-agreement-with-anthropic-to-support-growing-demand"
          },
          "stikkord": [
            "Anthropic",
            "Akamai",
            "Regnekraft"
          ]
        },
        {
          "id": "c028",
          "nivaa": "kort",
          "tittel": "Ankedomstol: Pentagon kan fortsatt stemple Anthropic som leverandørkjederisiko",
          "ingress": "En føderal ankedomstol i Washington (D.C. Circuit) lot 25. september Pentagons klassifisering av Anthropic som leverandørkjederisiko stå, med to mot én stemme. Forsvarsdepartementet kan dermed holde Claude utenfor egne systemer og leverandørers arbeid på forsvarskontrakter. Striden startet da Anthropic nektet å tillate «all lovlig bruk», med henvisning til autonome våpen og masseovervåking av amerikanere.",
          "hvorfor": "Saken tester om et AI-selskap kan sette etiske grenser for statlig bruk av modellene sine uten å bli stengt ute fra offentlige kontrakter. Utfallet påvirker AI-leverandørers forhandlingsmakt overfor forsvarskunder.",
          "kategori": "Regulering",
          "viktighet": 2,
          "dato": "2026-09-25",
          "kilde": {
            "navn": "Breaking Defense",
            "url": "https://breakingdefense.com/2026/09/dc-circuit-panel-upholds-pentagons-ban-on-anthropic-so-what-comes-next/"
          },
          "stikkord": [
            "Anthropic",
            "Pentagon",
            "Søksmål"
          ]
        },
        {
          "id": "g39-03",
          "nivaa": "kort",
          "tittel": "British Columbia saksøker OpenAI og Altman etter skoleskytingen i Tumbler Ridge",
          "ingress": "Den kanadiske provinsen og det lokale skoledistriktet har gått til sak i en føderal domstol i San Francisco, blant annet for uaktsomhet og utrygt produktdesign. Ifølge stevningen merket OpenAI skytterens ChatGPT-konto i juni 2025 for samtaler om våpenvold, og interne granskere anbefalte å varsle politiet, men ledelsen mente terskelen ikke var nådd. Skytingen 10. februar 2026 tok åtte liv.",
          "hvorfor": "Saken prøver om AI-selskaper har plikt til å varsle myndighetene om brukere som signaliserer voldsrisiko. Det er en ny type ansvarsrisiko for alle som bygger AI-produkter for forbrukere.",
          "kategori": "Regulering",
          "viktighet": 2,
          "dato": "2026-09-21",
          "kilde": {
            "navn": "Engadget",
            "url": "https://www.engadget.com/2264989/openai-tumbler-ridge-shooting-lawsuit/"
          },
          "stikkord": [
            "OpenAI",
            "Søksmål",
            "Canada"
          ]
        },
        {
          "id": "g39-05",
          "nivaa": "kort",
          "tittel": "Amazon stenger Metas AI-agent Muse ute fra nettbutikken sin",
          "ingress": "Siden 20. september har Metas AI-agent Muse ikke kunnet handle på Amazon.com, der brukere får beskjed om at en «uautorisert AI-agent» bryter vilkårene. Amazon sier Muse ikke gir seg til kjenne som agent og ser ut til å lagre kundenes innloggingsdata, noe Meta avviser. Få dager senere kunngjorde Meta handlesamarbeid med blant andre Walmart, Best Buy og Gap.",
          "hvorfor": "Det er et tidlig tegn på en plattformkamp om agentdrevet netthandel. Butikkene må velge om de slipper inn tredjeparts AI-agenter, med konsekvenser for annonseinntekter og kundeforholdet.",
          "kategori": "Næringsliv",
          "viktighet": 2,
          "dato": "2026-09-21",
          "kilde": {
            "navn": "TechCrunch",
            "url": "https://techcrunch.com/2026/09/21/metas-ai-agent-has-been-blocked-from-using-amazon-com/"
          },
          "stikkord": [
            "Meta",
            "Amazon",
            "Netthandel",
            "AI-agenter"
          ]
        },
        {
          "id": "g39-06",
          "nivaa": "kort",
          "tittel": "Svenske Lovable passerer 600 millioner dollar i årlig omsetningstakt",
          "ingress": "Stockholm-selskapet Lovable har passert 600 millioner dollar i årlig omsetningstakt, opp fra rundt 500 millioner i juni, sa medgründer Fabian Hedin på HumanX i Amsterdam 24. september. I august hentet selskapet 400 millioner dollar til en verdsettelse på 13,3 milliarder. Apper bygget på plattformen får nesten én milliard besøk i måneden.",
          "hvorfor": "Lovable er blant Nordens raskest voksende AI-selskaper, og veksten er et av de tydeligste tegnene på at AI-kodeverktøy faktisk tjener penger. Det gir en nyttig målestokk for nordiske investorer og gründere.",
          "kategori": "Næringsliv",
          "viktighet": 2,
          "dato": "2026-09-24",
          "kilde": {
            "navn": "TechCrunch",
            "url": "https://techcrunch.com/2026/09/24/lovables-annualized-revenue-crosses-600m-as-vibe-coding-takes-off/"
          },
          "stikkord": [
            "Lovable",
            "Sverige",
            "Vibe coding"
          ]
        }
      ]
    }
  ]
};

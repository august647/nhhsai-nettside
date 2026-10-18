"""Verktøy for nyhetssiden til NHHS AI.

Bruk (fra rotmappa i repoet):
    py verktoy/nyheter_verktoy.py sjekk
        Sjekker at nyheter-data.js er gyldig og følger formatet.

    py verktoy/nyheter_verktoy.py legg-til ny-uke.json
        Legger til (eller erstatter) en uke fra en JSON-fil og sjekker resultatet.
        JSON-fila kan være selve uke-objektet, eller {"week": {...}} slik workflowen
        «nyheter-ukentlig» returnerer det.

    py verktoy/nyheter_verktoy.py neste-uke [ÅÅÅÅ-MM-DD] [--ut args.json]
        Skriver ut uke-info (uke, aar, fra, til) for dagens dato eller datoen du gir,
        pluss titlene fra de to siste utgavene, klar til bruk som args til workflowen.
        Med --ut lagres det i en fil (trygt for æøå i PowerShell).
"""

import datetime as dt
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "public" / "nyheter-data.js"

KATEGORIER = {"Modeller", "Næringsliv", "Regulering", "Norge", "Forskning", "Verktøy", "Arbeidsliv"}
NIVAAER = {"hovedsak", "topp", "kort"}
DATO = re.compile(r"^\d{4}-\d{2}-\d{2}$")
PREFIX = "window.NHHS_NYHETER = "

HEADER = """/*
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
"""


def gyldig_dato(s) -> bool:
    """ÅÅÅÅ-MM-DD og en dato som faktisk finnes (ikke 2026-13-45 eller 2026-09-31)."""
    s = str(s)
    if not DATO.match(s):
        return False
    try:
        dt.date.fromisoformat(s)
        return True
    except ValueError:
        return False


def les() -> dict:
    tekst = DATA.read_text(encoding="utf-8")
    start = tekst.find(PREFIX)
    if start < 0:
        raise SystemExit(f"Fant ikke «{PREFIX.strip()}» i {DATA.name}")
    body = tekst[start + len(PREFIX):].strip()
    if body.endswith(";"):
        body = body[:-1]
    try:
        return json.loads(body)
    except json.JSONDecodeError as e:
        linje = tekst[: start + len(PREFIX)].count("\n") + e.lineno
        raise SystemExit(f"Ugyldig JSON i {DATA.name}, linje {linje}: {e.msg}")


def skriv(data: dict) -> None:
    data["uker"].sort(key=lambda w: (w["aar"], w["uke"]), reverse=True)
    DATA.write_text(HEADER + PREFIX + json.dumps(data, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


def sjekk_data(data: dict) -> list[str]:
    feil: list[str] = []
    uker = data.get("uker")
    if not isinstance(uker, list) or not uker:
        return ["«uker» mangler eller er tom"]
    sett = set()
    for w in uker:
        navn = f"uke {w.get('uke')}/{w.get('aar')}"
        for felt in ("uke", "aar", "fra", "til", "oppsummering", "saker"):
            if felt not in w:
                feil.append(f"{navn}: mangler «{felt}»")
        if not isinstance(w.get("uke"), int) or not isinstance(w.get("aar"), int):
            feil.append(f"{navn}: «uke» og «aar» må være tall uten anførselstegn")
            continue
        if (w.get("uke"), w.get("aar")) in sett:
            feil.append(f"{navn}: finnes flere ganger")
        sett.add((w.get("uke"), w.get("aar")))
        for felt in ("fra", "til", "publisert"):
            if felt in w and not gyldig_dato(w[felt]):
                feil.append(f"{navn}: «{felt}» ({w[felt]}) må være en gyldig dato på formen ÅÅÅÅ-MM-DD")
        if gyldig_dato(w.get("til", "")):
            aar, uke, _ = dt.date.fromisoformat(w["til"]).isocalendar()
            if (uke, aar) != (w["uke"], w["aar"]):
                feil.append(f"{navn}: «til» ({w['til']}) ligger i uke {uke}/{aar}, ikke i uke {w['uke']}/{w['aar']}")
            if gyldig_dato(w.get("fra", "")) and w["fra"] > w["til"]:
                feil.append(f"{navn}: «fra» ({w['fra']}) kommer etter «til» ({w['til']})")
        saker = w.get("saker", [])
        ids = [s.get("id") for s in saker]
        if len(ids) != len(set(ids)):
            feil.append(f"{navn}: to saker har samme id")
        hoved = [s for s in saker if s.get("nivaa") == "hovedsak"]
        if len(hoved) != 1:
            feil.append(f"{navn}: skal ha nøyaktig 1 hovedsak (har {len(hoved)})")
        tall = w.get("ukensTall")
        if tall and tall.get("sakId") not in ids:
            feil.append(f"{navn}: ukensTall.sakId «{tall.get('sakId')}» finnes ikke")
        for s in saker:
            sn = f"{navn}, sak «{s.get('id')}»"
            for felt in ("id", "nivaa", "tittel", "ingress", "hvorfor", "kategori", "viktighet", "dato", "kilde"):
                if felt not in s:
                    feil.append(f"{sn}: mangler «{felt}»")
            if s.get("nivaa") not in NIVAAER:
                feil.append(f"{sn}: nivaa må være hovedsak, topp eller kort")
            if s.get("kategori") not in KATEGORIER:
                feil.append(f"{sn}: ukjent kategori «{s.get('kategori')}»")
            if not isinstance(s.get("viktighet"), int) or not 1 <= s["viktighet"] <= 5:
                feil.append(f"{sn}: viktighet må være et heltall 1–5")
            if not gyldig_dato(s.get("dato", "")):
                feil.append(f"{sn}: dato ({s.get('dato')}) må være en gyldig dato på formen ÅÅÅÅ-MM-DD")
            elif gyldig_dato(w.get("fra", "")) and gyldig_dato(w.get("til", "")) and not (w["fra"] <= s["dato"] <= w["til"]):
                feil.append(f"{sn}: dato {s['dato']} ligger utenfor uka ({w['fra']}–{w['til']})")
            url = (s.get("kilde") or {}).get("url", "")
            if not str(url).startswith(("https://", "http://")):
                feil.append(f"{sn}: kilde.url må starte med https://")
            if len(s.get("tittel", "")) > 110:
                feil.append(f"{sn}: tittelen er lang ({len(s['tittel'])} tegn)")
    return feil


def stikkord_nokkel(t: str) -> str:
    """«AI-agenter», «Agenter» og «ai agenter» gir samme nøkkel."""
    k = re.sub(r"^(ai|ki)-(?=.)", "", str(t).lower().strip())
    return re.sub(r"[\s\-]+", "", k)


def advarsler(data: dict) -> list[str]:
    """Ikke feil, men ting som gjør stikkordsøket dårligere."""
    varsel: list[str] = []
    bruk: dict[str, dict[str, list[str]]] = {}
    for w in data.get("uker", []):
        for s in w.get("saker", []):
            for t in s.get("stikkord", []):
                bruk.setdefault(stikkord_nokkel(t), {}).setdefault(t, []).append(f"uke {w.get('uke')}/{s.get('id')}")
                if str(t).lower() in {k.lower() for k in KATEGORIER}:
                    varsel.append(f"Stikkordet «{t}» ({w.get('uke')}/{s.get('id')}) er også et kategorinavn – bruk et mer spesifikt stikkord")
    for former in bruk.values():
        if len(former) > 1:
            varsel.append("Samme stikkord skrevet ulikt: " + "; ".join(f"«{t}» ({', '.join(steder)})" for t, steder in former.items()))
    return varsel


def iso_uke(d: dt.date) -> dict:
    aar, uke, ukedag = d.isocalendar()
    mandag = d - dt.timedelta(days=ukedag - 1)
    return {"today": d.isoformat(), "uke": uke, "aar": aar, "fra": mandag.isoformat(), "til": d.isoformat()}


def les_json(sti: str) -> dict:
    """Leser JSON uansett om fila er lagret som UTF-8, UTF-8 med BOM eller UTF-16 (PowerShell)."""
    raw = Path(sti).read_bytes()
    if raw.startswith((b"\xff\xfe", b"\xfe\xff")):
        return json.loads(raw.decode("utf-16"))
    return json.loads(raw.decode("utf-8-sig"))


def main() -> None:
    args = sys.argv[1:]
    ut = None
    if "--ut" in args:
        i = args.index("--ut")
        if i + 1 >= len(args):
            raise SystemExit("Bruk: --ut <fil.json>")
        ut = args[i + 1]
        del args[i:i + 2]
    sys.argv = sys.argv[:1] + args
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    cmd = sys.argv[1]
    if cmd == "sjekk":
        data = les()
        feil = sjekk_data(data)
        if feil:
            print("Fant feil:\n- " + "\n- ".join(feil))
            raise SystemExit(1)
        uker = sorted(data["uker"], key=lambda w: (w["aar"], w["uke"]), reverse=True)
        print(f"OK: {len(uker)} uker, {sum(len(w['saker']) for w in uker)} saker. Siste: uke {uker[0]['uke']} {uker[0]['aar']}.")
        for v in advarsler(data):
            print("Advarsel:", v)
    elif cmd == "legg-til":
        if len(sys.argv) < 3:
            raise SystemExit("Bruk: legg-til ny-uke.json")
        ny = les_json(sys.argv[2])
        ny = ny.get("week", ny)
        data = les()
        finnes = [w for w in data["uker"] if (w.get("uke"), w.get("aar")) == (ny.get("uke"), ny.get("aar"))]
        if finnes:
            print(f"Merk: uke {ny.get('uke')} {ny.get('aar')} fantes allerede og blir erstattet.")
        data["uker"] = [w for w in data["uker"] if w not in finnes]
        data["uker"].append(ny)
        data["oppdatert"] = ny.get("publisert") or dt.date.today().isoformat()
        feil = sjekk_data(data)
        if feil:
            print("Uka ble IKKE lagt til. Feil:\n- " + "\n- ".join(feil))
            raise SystemExit(1)
        skriv(data)
        print(f"La til uke {ny['uke']} {ny['aar']} med {len(ny['saker'])} saker.")
        for v in advarsler(data):
            print("Advarsel:", v)
    elif cmd == "neste-uke":
        if len(sys.argv) > 2 and not gyldig_dato(sys.argv[2]):
            raise SystemExit(f"Ugyldig dato «{sys.argv[2]}». Bruk ÅÅÅÅ-MM-DD.")
        d = dt.date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else dt.date.today()
        info = iso_uke(d)
        try:
            data = les()
            tidligere = [w for w in data["uker"] if (w["uke"], w["aar"]) != (info["uke"], info["aar"])]
            siste = sorted(tidligere, key=lambda w: (w["aar"], w["uke"]), reverse=True)[:2]
            info["forrigeTitler"] = [s["tittel"] for w in siste for s in w["saker"]]
            # Eksisterende stikkord (mest brukte først), så nye utgaver gjenbruker samme skrivemåte.
            teller: dict[str, int] = {}
            for w in data["uker"]:
                for s in w["saker"]:
                    for t in s.get("stikkord", []):
                        teller[t] = teller.get(t, 0) + 1
            info["stikkord"] = sorted(teller, key=lambda t: (-teller[t], t.lower()))[:80]
            # Dekk alt siden forrige utgave, også helgen og resten av forrige publiseringsdag
            # (overlappen på én dag tas hånd om av forrigeTitler), men aldri mer enn to uker bakover.
            if siste and gyldig_dato(siste[0].get("til", "")):
                forrige_til = dt.date.fromisoformat(siste[0]["til"])
                if d - dt.timedelta(days=13) <= forrige_til < d:
                    info["fra"] = forrige_til.isoformat()
        except SystemExit as e:
            print(f"Advarsel: kunne ikke lese datafila ({e}). Bruker mandag som start og ingen tidligere titler.", file=sys.stderr)
            info["forrigeTitler"] = []
            info["stikkord"] = []
        tekst = json.dumps(info, ensure_ascii=False, indent=2)
        if ut:
            Path(ut).write_text(tekst, encoding="utf-8")
            print(f"Skrev {ut}")
        else:
            print(tekst)
    else:
        raise SystemExit(__doc__)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

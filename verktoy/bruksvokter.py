#!/usr/bin/env python3
"""Passer på abonnementets bruksgrenser mens Claude Code lager nyhetsutgaven.

Claude Code skriver en rate_limit_event til loggen (stream-json) for hvert svar fra modellen.
Der står hvor mye av fem-timersvinduet og av uka som er brukt, som tall mellom 0 og 1.

To kommandoer:

  vokt    Kjører ved siden av Claude. Stopper prosessen (SIGTERM, så SIGKILL) når
          ukebruken når grensen, når en grense er nådd (status rejected), eller når
          tiden er ute. Arbeidsfilene er allerede skrevet til disk, så ingenting går tapt.
  status  Skriver en kort oppsummering (markdown) av bruken i loggen.

Eksempler:

  python3 verktoy/bruksvokter.py vokt --pid 1234 --logg claude-logg.jsonl --stopp claude-stopp.txt
  python3 verktoy/bruksvokter.py status --logg claude-logg.jsonl
"""
import argparse
import json
import os
import signal
import sys
import time
from datetime import datetime
from zoneinfo import ZoneInfo

OSLO = ZoneInfo("Europe/Oslo")
DAGER = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]


def hendelser(sti, maks_byte=None):
    """Alle rate_limit_event-linjene i loggen, eldste først. Med maks_byte leses bare slutten."""
    try:
        with open(sti, "rb") as f:
            if maks_byte:
                f.seek(0, os.SEEK_END)
                storrelse = f.tell()
                f.seek(max(0, storrelse - maks_byte))
            data = f.read()
    except OSError:
        return []
    ut = []
    for linje in data.splitlines():
        if b'"rate_limit_event"' not in linje:
            continue
        try:
            h = json.loads(linje)
        except ValueError:
            continue
        if h.get("type") == "rate_limit_event" and isinstance(h.get("rate_limit_info"), dict):
            ut.append(h["rate_limit_info"])
    return ut


def vindu(info, navn):
    v = (info.get("unifiedWindows") or {}).get(navn) or {}
    return v.get("utilization"), v.get("resetsAt")


def prosent(x):
    return "?" if x is None else f"{round(x * 100)} %"


def tidspunkt(epoch):
    if not epoch:
        return "ukjent tid"
    d = datetime.fromtimestamp(epoch, OSLO)
    return f"{DAGER[d.weekday()]} {d.day}.{d.month}. kl. {d:%H.%M}"


def er_borte(pid):
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return True
    except PermissionError:
        return False
    return False


def stopp_prosess(pid, ventetid=30):
    try:
        os.kill(pid, signal.SIGTERM)
    except ProcessLookupError:
        return
    slutt = time.time() + ventetid
    while time.time() < slutt:
        if er_borte(pid):
            return
        time.sleep(1)
    try:
        os.kill(pid, signal.SIGKILL)
    except ProcessLookupError:
        pass


def vurder(info, ukegrense):
    """Gir en tekst med årsak hvis Claude bør stoppes, ellers None."""
    uke, uke_reset = vindu(info, "seven_day")
    fem, fem_reset = vindu(info, "five_hour")
    if info.get("status") == "rejected":
        return (
            f"Bruksgrensen er nådd. Fem timer: {prosent(fem)}, uke: {prosent(uke)}. "
            f"Fem-timersvinduet nullstilles {tidspunkt(fem_reset)}, uka {tidspunkt(uke_reset)}."
        )
    if uke is not None and uke >= ukegrense:
        return (
            f"Ukebruken er {prosent(uke)}, som er over grensen på {prosent(ukegrense)}. "
            f"Jobben stoppes så ikke hele ukegrensen går med. Uka nullstilles {tidspunkt(uke_reset)}."
        )
    return None


def kommando_vokt(a):
    start = time.time()
    while not er_borte(a.pid):
        time.sleep(a.intervall)
        if er_borte(a.pid):
            return 0
        arsak = None
        if a.maks_minutter and time.time() - start > a.maks_minutter * 60:
            arsak = f"Tidsgrensen på {a.maks_minutter} minutter er nådd."
        else:
            alle = hendelser(a.logg, maks_byte=2_000_000)
            if alle:
                arsak = vurder(alle[-1], a.ukegrense)
        if arsak:
            with open(a.stopp, "w", encoding="utf-8") as f:
                f.write(arsak + "\n")
            print("Bruksvokteren stopper Claude: " + arsak, flush=True)
            stopp_prosess(a.pid)
            return 0
    return 0


def kommando_status(a):
    alle = hendelser(a.logg)
    if not alle:
        print("Ingen bruksdata i loggen.")
        return 0
    f, s = alle[0], alle[-1]
    f5, _ = vindu(f, "five_hour")
    f7, _ = vindu(f, "seven_day")
    s5, r5 = vindu(s, "five_hour")
    s7, r7 = vindu(s, "seven_day")
    print("Bruk i abonnementet (fra første til siste måling i denne kjøringen):")
    print()
    print(f"- Fem-timersvindu: {prosent(f5)} til {prosent(s5)}. Nullstilles {tidspunkt(r5)}.")
    print(f"- Uke: {prosent(f7)} til {prosent(s7)}. Nullstilles {tidspunkt(r7)}.")
    avvist = sum(1 for h in alle if h.get("status") == "rejected")
    if avvist:
        print(f"- Grensen ble nådd ({avvist} avviste målinger i loggen).")
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="kommando", required=True)
    v = sub.add_parser("vokt", help="stopp Claude når en grense nås")
    v.add_argument("--pid", type=int, required=True)
    v.add_argument("--logg", required=True)
    v.add_argument("--stopp", required=True, help="fil som får årsaken hvis Claude stoppes")
    v.add_argument("--ukegrense", type=float, default=0.95, help="stopp ved denne ukebruken, 0 til 1")
    v.add_argument("--intervall", type=float, default=15, help="sekunder mellom hver sjekk")
    v.add_argument("--maks-minutter", dest="maks_minutter", type=float, default=0)
    v.set_defaults(fn=kommando_vokt)
    s = sub.add_parser("status", help="skriv oppsummering av bruken")
    s.add_argument("--logg", required=True)
    s.set_defaults(fn=kommando_status)
    a = p.parse_args()
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())

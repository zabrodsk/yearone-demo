# -*- coding: utf-8 -*-
"""Rozhrani k datum (sandbox) - linie VEREJNA SPRAVA.
Agenta, ktery data cte, dohledava a hlida v case, stavite vy.
"""
import json, os

_D = os.path.dirname(__file__)
def _load(name):
    with open(os.path.join(_D, name), encoding="utf-8") as f:
        return json.load(f)

_ZAMERY = {z["id"]: z for z in _load("zamery_firem.json")}
_ARES = _load("registr_ares.json")
_ZIV = _load("klasifikace_zivnosti.json")

_BURDEN = {"otazky": 0}     # zatez zakladatele (dohledatelne otazky)
_PLAN = []                  # naplanovane povinnosti (hlidani v case)


def get_intent(fid):
    """Zamer firmy (vidi kazdy)."""
    return _ZAMERY.get(fid)


def lookup_registry(typ, klic):
    """Dohledani v registru. NEzatezuje zakladatele.
       typ='ares' (klic=ICO) | typ='zivnost' (klic=predmet)."""
    if typ == "ares":
        return _ARES.get(str(klic))
    if typ == "zivnost":
        t = _ZIV.get(klic)
        return {"predmet": klic, "typ_zivnosti": t} if t else None
    return None


def lookup_legislation(tema):
    """Placeholder. Nahradte vlastni resersi platneho predpisu
       (zakon o obchodnich korporacich, zivnostensky zakon, zakon o DPH...)."""
    return {"tema": tema, "poznamka": "Dohledejte platne zneni a prahy (napr. obrat pro DPH)."}


def ask_founder(fid, otazka):
    """Dotaz primo na zakladatele. Vzdy dostupne, ALE pocita se do jeho zateze.
       Dobry agent si dohledatelne veci najde v registrech a pta se jen vyjimecne."""
    _BURDEN["otazky"] += 1
    z = _ZAMERY.get(fid, {})
    return {"id": fid, "otazka": otazka, "zamer": z}


def schedule(fid, povinnost, termin):
    """Naplanuje hlidani povinnosti v case (napr. DPH pri prekroceni obratu)."""
    _PLAN.append({"id": fid, "povinnost": povinnost, "termin": termin})
    return {"id": fid, "naplanovano": povinnost, "termin": termin}


def founder_burden():
    """Kolik dohledatelnych otazek jste polozili zakladateli (nizsi = lepe)."""
    return _BURDEN["otazky"]


def planned():
    return list(_PLAN)

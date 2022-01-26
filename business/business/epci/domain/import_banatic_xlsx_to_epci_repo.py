from typing import List
import pandas as pd
from .epci_repo import AbstractEpciRepository
from .epci import Epci


def import_banatic_xlsx_to_epci_repo(
    epci_repo: AbstractEpciRepository,
    input_xlsx="business/epci/data/banatic_2021.xlsx",
):
    df = pd.read_excel(input_xlsx, dtype=str)
    competences_to_filter = ["C1510", "C1555"]
    nature_to_filter = ["METRO", "PETR", "CC"]

    df_filterd = df[
        df[competences_to_filter].astype(int).any(axis=1)  # type: ignore
        | df["Nature juridique"].isin(nature_to_filter)
    ]

    df_epcis = df_filterd[["N° SIREN", "Nom du groupement", "Nature juridique"]].rename(
        columns={  # type: ignore
            "N° SIREN": "siren",
            "Nom du groupement": "nom",
            "Nature juridique": "nature",
        }
    )
    epcis: List[Epci] = list(
        df_epcis.apply(lambda s: Epci(s.nom, s.siren, s.nature), axis=1).values
    )
    epci_repo.add_epcis(epcis)

from dataclasses import dataclass
from typing import Literal


@dataclass
class Personnalisation:
    id: str
    titre: str
    type: Literal["reduction", "desactivation", "score"]
    regle: str
    description: str = ""

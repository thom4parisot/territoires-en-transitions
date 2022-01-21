from dataclasses import dataclass

from business.utils.action_id import ActionId
from business.core.domain.models.referentiel import ActionReferentiel


@dataclass
class ActionComputedPoint:
    referentiel: ActionReferentiel
    action_id: ActionId
    value: float
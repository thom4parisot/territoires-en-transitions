from typing import Dict, Optional
import re

from business.evaluation.domain.models.action_score import ActionScore
from business.personnalisation.engine.formule_interpreter import FormuleInterpreter
from business.utils.action_id import ActionId
from business.personnalisation.engine.parser import parser


formule_interpreter = FormuleInterpreter()


def execute_score_personnalisation_factor_regle(
    formule: str, scores: Dict[ActionId, ActionScore]
) -> Optional[float]:
    """Execute a personnalisation regle based on score. Returns the factor to apply to the potentiel."""
    action_ids = re.findall("score[^(]*\(([^)]*)\)", formule)
    formule_with_score_replaced = formule
    for action_id in action_ids:
        score = scores.get(ActionId(action_id))
        if score is None:
            return None
        point_max = score.point_potentiel_perso or score.point_potentiel
        formule_with_score_replaced = formule_with_score_replaced.replace(
            f"score({action_id})", str(score.point_fait / point_max)
        )
    tree = parser.parse(formule_with_score_replaced)
    return formule_interpreter.visit(tree)
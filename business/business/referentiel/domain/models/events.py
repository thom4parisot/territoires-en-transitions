from dataclasses import dataclass
from pathlib import Path
from typing import List

from business.referentiel.domain.models.question import Question

from .action_definition import ActionDefinition
from .action_children import ActionChildren
from .action_computed_point import ActionComputedPoint
from business.referentiel.domain.models.referentiel import ActionReferentiel
from business.utils.domain_message_bus import DomainEvent, DomainFailureEvent
from .markdown_action_node import MarkdownActionNode
from .indicateur import Indicateur
from .personnalisation import ActionPersonnalisationRegles


@dataclass
class MarkdownReferentielFolderUpdated(DomainEvent):
    folder_path: str


@dataclass
class MarkdownReferentielFolderParsed(DomainEvent):
    referentiel_node: MarkdownActionNode


@dataclass
class ParseMarkdownReferentielFolderFailed(DomainFailureEvent):
    pass


@dataclass
class ParseMarkdownReferentielFolderEmpty(DomainEvent):
    pass


@dataclass
class MarkdownReferentielNodeConvertedToEntities(DomainEvent):
    definitions: List[ActionDefinition]
    points: List[ActionComputedPoint]
    children: List[ActionChildren]
    referentiel: ActionReferentiel


@dataclass
class MarkdownReferentielNodeInconsistencyFound(DomainFailureEvent):  # FAILURE
    pass


@dataclass
class ReferentielActionsStored(DomainEvent):
    referentiel: ActionReferentiel


@dataclass
class ReferentielIndicateursStored(DomainEvent):
    referentiel: ActionReferentiel


@dataclass
class ReferentielStorageFailed(DomainFailureEvent):
    pass


@dataclass
class IndicateurStored(DomainEvent):
    referentiel: ActionReferentiel


@dataclass
class IndicateurMarkdownConvertedToEntities(DomainEvent):
    indicateurs: List[Indicateur]
    referentiel: ActionReferentiel


@dataclass
class IndicateurMarkdownParsingOrConvertionFailed(DomainFailureEvent):
    pass


@dataclass
class IndicateurEntitiesStored(DomainEvent):
    pass


@dataclass
class ExtractReferentielActionsToCsvTriggered(DomainEvent):
    referentiel: ActionReferentiel
    csv_path: Path


@dataclass
class ParseAndConvertMarkdownIndicateursToEntitiesTriggered(DomainEvent):
    folder_path: str
    referentiel: ActionReferentiel


@dataclass
class ParseAndConvertMarkdownPersonnalisationsTriggered(DomainEvent):
    question_folder_path: str
    regle_folder_path: str


@dataclass
class ParseAndStorePreuvesTriggered(DomainEvent):
    folder_path: str


@dataclass
class QuestionMarkdownParsingOrConvertionFailed(DomainFailureEvent):
    pass


@dataclass
class QuestionMarkdownConvertedToEntities(DomainEvent):
    questions: List[Question]
    question_folder_path: str
    regle_folder_path: str


@dataclass
class ReferentielQuestionsStored(DomainEvent):
    pass


@dataclass
class QuestionAndPersonnalisationMarkdownConvertedToEntities(DomainEvent):
    questions: List[Question]
    regles: List[ActionPersonnalisationRegles]


@dataclass
class QuestionAndReglesChecked(DomainEvent):
    questions: List[Question]
    regles: List[ActionPersonnalisationRegles]


@dataclass
class QuestionAndReglesCheckingFailed(DomainFailureEvent):
    pass


@dataclass
class ReglesMarkdownParsingOrConvertionFailed(DomainFailureEvent):
    pass


@dataclass
class ReferentielPersonnalisationStored(DomainEvent):
    pass

from dataclasses import dataclass
from glob import glob
import os
from pathlib import Path
from typing import List, Literal, Tuple

from marshmallow import ValidationError
import marshmallow_dataclass

from business.referentiel.domain.models import events
from business.referentiel.domain.models.personnalisation import Personnalisation
from business.utils.domain_message_bus import (
    AbstractDomainMessageBus,
)
from business.referentiel.domain.ports.referentiel_repo import (
    AbstractReferentielRepository,
)
from business.utils.markdown_import.markdown_parser import (
    build_markdown_parser,
)
from business.utils.markdown_import.markdown_utils import load_md
from business.utils.use_case import UseCase


@dataclass
class MarkdownPersonnalisation:
    """Personnalisation as defined in markdown files"""
    id: str
    titre: str
    type: Literal["reduction", "desactivation", "score"]
    regle: str
    description: str = ""


class ParseAndConvertMarkdownReferentielPersonnalisation(UseCase):
    def __init__(
            self,
            bus: AbstractDomainMessageBus,
            referentiel_repo: AbstractReferentielRepository,
    ) -> None:
        self.bus = bus
        self.referentiel_repo = referentiel_repo
        self._markdown_question_schema = marshmallow_dataclass.class_schema(
            MarkdownPersonnalisation
        )()

    def execute(
            self, trigger: events.ParseAndConvertMarkdownReferentielPersonnalisationTriggered
    ):
        md_files = glob(os.path.join(trigger.folder_path, "*.md"))
        print(f"Parsing {len(md_files)} files with personnalisation")
        # parse
        md_personnalisation, parsing_errors = self.parse(md_files)

        if parsing_errors:
            self.bus.publish_event(
                events.QuestionMarkdownParsingOrConvertionFailed(
                    f"Incohérences dans le parsing de {len(parsing_errors)} indicateurs: \n"
                    + "\n".join(parsing_errors)
                )
            )
            return

        # convert
        personnalisation, conversion_errors = self.convert(md_personnalisation)

        if conversion_errors:
            self.bus.publish_event(
                events.QuestionMarkdownParsingOrConvertionFailed(
                    f"Incohérences dans la conversion de {len(conversion_errors)} indicateurs: \n"
                    + "\n".join(conversion_errors)
                )
            )
            return

        self.bus.publish_event(events.PersonnalisationMarkdownConvertedToEntities(personnalisation))

    def parse(self, md_files: List[str]) -> Tuple[List[MarkdownPersonnalisation], List[str]]:
        md_personnalisation: List[MarkdownPersonnalisation] = []
        parsing_errors: List[str] = []
        for md_file in md_files:
            md_personnalisation_as_dict = self._build_md_personnalisation_as_dict_from_md(md_file)
            for md_question_as_dict in md_personnalisation_as_dict:
                try:
                    md_question = self._markdown_question_schema.load(
                        md_question_as_dict
                    )
                    md_personnalisation.append(md_question)
                except ValidationError as error:
                    parsing_errors.append(f"In file {Path(md_file).name} {str(error)}")
        return md_personnalisation, parsing_errors

    @staticmethod
    def _build_md_personnalisation_as_dict_from_md(path: str) -> List[dict]:
        """Extract a question from a markdown document"""

        markdown = load_md(path)
        parser = build_markdown_parser(
            title_key="titre",
            description_key="description",
            initial_keyword="personnalisation",
            keyword_node_builders={"personnalisation": lambda: {"titre": "", "choix": []},
                                   "choix": lambda: {"titre": ""}}
        )
        question_as_dict = parser(markdown)
        return question_as_dict

    def convert(
            self, md_personnalisations: List[MarkdownPersonnalisation]
    ) -> Tuple[List[Personnalisation], List[str]]:

        personnalisation = [
            Personnalisation(md_personnalisation)
            for md_personnalisation in md_personnalisations
        ]

        # todo : check that action_id exist
        # todo : check that if  type="choix", choix is not empty
        failures = []
        return personnalisation, failures

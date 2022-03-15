from typing import Optional

from business.referentiel.domain.use_cases.parse_and_convert_markdown_referentiel_personnalisation import (
    ParseAndConvertMarkdownReferentielPersonnalisation,
)
from business.utils.domain_message_bus import (
    InMemoryDomainMessageBus,
)
from business.referentiel.domain.ports.referentiel_repo import (
    AbstractReferentielRepository,
    InMemoryReferentielRepository,
)
from business.referentiel.domain.models import events
from tests.utils.referentiel_factory import make_dummy_referentiel
from tests.utils.spy_on_event import spy_on_event


def prepare_use_case(
    folder_path: str,
    referentiel_repo: Optional[AbstractReferentielRepository] = None,
):
    test_command = events.ParseAndConvertMarkdownReferentielPersonnalisationTriggered(
        folder_path=folder_path
    )
    bus = InMemoryDomainMessageBus()
    referentiel_repo = referentiel_repo or InMemoryReferentielRepository()

    use_case = ParseAndConvertMarkdownReferentielPersonnalisation(bus, referentiel_repo)

    failure_events = spy_on_event(
        bus, events.QuestionMarkdownParsingOrConvertionFailed
    )
    parsed_events = spy_on_event(bus, events.IndicateurMarkdownConvertedToEntities)
    use_case.execute(test_command)
    return failure_events, parsed_events


def test_parse_and_convert_markdown_referentiel_personnalisation_from_ok_folder():
    referentiel_repo = InMemoryReferentielRepository(
        *make_dummy_referentiel(
            action_ids=["eci_1", "eci_2"]
        )  # eci_1 and eci_2 are refered in some personnalisation, so should exist in db
    )
    failure_events, parsed_events = prepare_use_case(
        "./tests/data/md_personnalisation_example_ok", referentiel_repo=referentiel_repo
    )
    assert len(failure_events) == 0
    assert len(parsed_events) == 4

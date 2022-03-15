from pathlib import Path

from business.referentiel.adapters.sql_referentiel_repo import SqlReferentielRepository
from business.referentiel.domain.models.question import Choix, Question
from business.utils.action_id import ActionId
from tests.utils.files import remove_file, mkdir
from tests.utils.referentiel_factory import (
    make_action_children,
    make_action_definition,
    make_action_points,
    make_indicateur,
)


def test_can_add_referentiel_actions():

    sql_path = Path("./tests/data/tmp/referentiel_actions.sql")
    mkdir(sql_path.parent)
    remove_file(sql_path)

    repo = SqlReferentielRepository(sql_path)

    definition_ref = make_action_definition(
        action_id="ref", referentiel="eci", description="l'ademe !"
    )
    definition_ref_1 = make_action_definition(action_id="ref_1", referentiel="eci")

    children_ref = make_action_children(action_id="ref", children_ids=["ref_1"])
    children_ref_1 = make_action_children(action_id="ref_1", children_ids=[])

    points_ref = make_action_points(action_id="ref", points=500)
    points_ref_1 = make_action_points(action_id="ref_1", points=300)

    repo.add_referentiel_actions(
        definitions=[definition_ref, definition_ref_1],
        children=[children_ref, children_ref_1],
        points=[points_ref, points_ref_1],
    )

    with open(sql_path) as file:
        file_content = file.read()

    assert (
        file_content
        == "insert into action_relation(id, referentiel, parent) values ('ref', 'eci', null);\n"
        + "insert into action_relation(id, referentiel, parent) values ('ref_1', 'eci', 'ref');\n"
        + "insert into action_definition(action_id, referentiel, identifiant, nom, description, contexte, exemples, preuve, ressources, perimetre_evaluation, reduction_potentiel, points, pourcentage) values ('ref', 'eci', '', '', 'l''ademe !', '', '', '', '', '', '', null, null);\n"
        + "insert into action_definition(action_id, referentiel, identifiant, nom, description, contexte, exemples, preuve, ressources, perimetre_evaluation, reduction_potentiel, points, pourcentage) values ('ref_1', 'eci', '', '', '', '', '', '', '', '', '', null, null);\n"
        + "insert into action_computed_points(action_id, value) values ('ref', 500);\n"
        + "insert into action_computed_points(action_id, value) values ('ref_1', 300);\n"
    )

    # # check that sql can be executed and referntiel actions can be added
    # test_cursor = postgres_connection.cursor(row_factory=dict_row)
    # test_cursor.execute(file_content)

    # # check referentiel action have correctly been inserted
    # test_cursor.execute("select * from action_relation where id in ('ref', 'ref_1');")
    # inserted_relations = test_cursor.fetchall()
    # assert len(inserted_relations) == 2
    # assert inserted_relations == [
    #     {"id": "ref", "referentiel": "eci", "parent": None},
    #     {"id": "ref_1", "referentiel": "eci", "parent": "ref"},
    # ]

    # test_cursor.execute(
    #     "select * from action_computed_points where action_id in ('ref', 'ref_1');"
    # )
    # inserted_points = test_cursor.fetchall()
    # assert len(inserted_points) == 2

    # test_cursor.execute(
    #     "select * from action_definition where action_id in ('ref', 'ref_1');"
    # )
    # inserted_definitions = test_cursor.fetchall()
    # assert len(inserted_definitions) == 2


def test_can_add_referentiel_indicateurs():

    sql_path = Path("./tests/data/tmp/referentiel_indicateurs.sql")
    mkdir(sql_path.parent)
    remove_file(sql_path)

    repo = SqlReferentielRepository(sql_path)

    indicateur_def = make_indicateur(
        indicateur_id="indicateur_1",
        indicateur_group="eci",
        description="l'ademe !",
        action_ids=["eci_1"],
    )

    repo.add_indicateurs([indicateur_def])

    with open(sql_path) as file:
        file_content = file.read()
    assert (
        file_content
        == "insert into indicateur_definition(id, indicateur_group, identifiant, valeur_indicateur, nom, description, unite, obligation_eci, parent) values ('indicateur_1', 'eci', '', null, '', 'l''ademe !', '', false, null);insert into indicateur_action(indicateur_id, action_id) values ('indicateur_1', 'eci_1');\n"
    )


def test_can_add_referentiel_questions():

    sql_path = Path("./tests/data/tmp/referentiel_questions.sql")
    mkdir(sql_path.parent)
    remove_file(sql_path)

    repo = SqlReferentielRepository(sql_path)

    question = Question(
        id="question_1",
        formulation="Est-ce que la collectivité est compétente en voirie ?",
        description="Une petite description",
        action_ids=[ActionId("eci_1")],
        type="choix",
        choix=[
            Choix(
                id="question_a",
                formulation="Oui",
            ),
            Choix(
                id="question_b",
                formulation="Non",
            ),
        ],
    )

    repo.upsert_questions([question])

    with open(sql_path) as file:
        file_content = file.read()
    assert file_content == "TODO"

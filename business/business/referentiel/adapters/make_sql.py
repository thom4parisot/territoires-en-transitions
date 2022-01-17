from typing import Dict, List
from business.core.domain.models.referentiel import ActionReferentiel
from business.referentiel.domain.models.indicateur import Indicateur

from business.referentiel.domain.ports.referentiel_repo import (
    ReferentielEntities,
)


def _format_text(text: str):
    return text.replace("'", "''")


def make_sql_insert_indicateurs(indicateurs: List[Indicateur]):
    sqls = []
    for indicateur in indicateurs:
        sql = f"insert into indicateur_definition(id, indicateur_group, identifiant, valeur_indicateur, nom, description, unite, obligation_eci, parent) values ('{indicateur.indicateur_id}', '{indicateur.indicateur_group}', '{indicateur.identifiant}', {indicateur.values_refers_to or 'null'}, '{_format_text(indicateur.nom)}', '{_format_text(indicateur.description)}', '{_format_text(indicateur.unite)}', {indicateur.obligation_eci} ,  null);"
        sqls.append(sql)

    return "\n".join(sqls)


def _make_sql_insert_action_definition(
    actions_by_ref: Dict[ActionReferentiel, ReferentielEntities]
):
    sqls = []
    for referentiel, referentiel_entities in actions_by_ref.items():
        for definition in referentiel_entities.definitions:
            sql = f"insert into action_definition(action_id, referentiel, identifiant, nom, description, contexte, exemples, ressources, points, pourcentage) values ('{definition.action_id}', '{definition.referentiel}', '{definition.identifiant}', '{_format_text(definition.nom)}', '{_format_text(definition.description)}', '{_format_text(definition.contexte)}', '{_format_text(definition.exemples)}', '{_format_text(definition.ressources)}', {definition.points or 'null'}, {definition.pourcentage or 'null'});"
            sqls.append(sql)
    return "\n".join(sqls)


def _make_sql_insert_action_computed_points(
    actions_by_ref: Dict[ActionReferentiel, ReferentielEntities]
):
    sqls = []
    for referentiel, referentiel_entities in actions_by_ref.items():
        for points in referentiel_entities.points:
            sql = f"insert into action_computed_points(action_id, value) values ('{points.action_id}', '{points.value}');"
            sqls.append(sql)
    return "\n".join(sqls)


def _make_sql_insert_action_relations(
    actions_by_ref: Dict[ActionReferentiel, ReferentielEntities]
):
    sqls = []
    for referentiel, referentiel_entities in actions_by_ref.items():
        for children in referentiel_entities.children:
            if len(children.action_id.split("_")) == 1:  # root action
                sql = f"insert into action_relation(id, referentiel, parent) values ('{children.action_id}', '{referentiel}', null);"
                sqls.append(sql)
            for child_id in children.children:
                sql = f"insert into action_relation(id, referentiel, parent) values ('{child_id}', '{referentiel}', '{children.action_id}');"
                sqls.append(sql)
    return "\n".join(sqls)


def make_sql_insert_actions(
    actions_by_ref: Dict[ActionReferentiel, ReferentielEntities]
):
    sql = (
        _make_sql_insert_action_relations(actions_by_ref)
        + _make_sql_insert_action_definition(actions_by_ref)
        + _make_sql_insert_action_computed_points(actions_by_ref)
    )
    return sql

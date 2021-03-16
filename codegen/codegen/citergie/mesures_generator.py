"""Générateur pour les mesures, génère les exemples dans /generated/citergie."""
import json
from typing import Callable, List

import jsbeautifier
from bs4 import BeautifulSoup
from mistletoe import Document
from mistletoe.block_token import Heading, BlockToken, CodeFence

from codegen.climat_pratic.thematiques_generator import get_thematiques
from codegen.utils.markdown_utils import void, is_heading, is_yaml, is_keyword, token_to_string, update_with_yaml
from codegen.utils.templates import build_jinja_environment


def meta(token: BlockToken, data: dict) -> None:
    """save ```yaml block"""
    return update_with_yaml(token, data)


def actions_writer() -> Callable:
    """Returns a closure to keep track of current writer function. Also scope actions related functions."""

    def head(token: BlockToken, action: dict) -> None:
        """Save action h3"""
        if isinstance(token, Heading) and token.level == 3:
            action['nom'] = token.children[0].content

    def description(token: BlockToken, action: dict) -> None:
        """Save action description as an HTML string"""
        if is_keyword(token, 'description'):
            return
        if 'description' not in action.keys():
            action['description'] = ''
        action['description'] += token_to_string(token)

    current: Callable = head

    def writer(token: BlockToken, mesure: dict) -> None:
        """Save actions"""
        if is_keyword(token, 'actions'):
            return
        if 'actions' not in mesure.keys():
            mesure['actions'] = [{}]
        actions: list = mesure['actions']
        action: dict = actions[-1]

        nonlocal current
        if action:
            if is_heading(token, 3):
                action = {}
                actions.append(action)
                current = head
            elif isinstance(token, CodeFence):
                current = meta
            elif current == meta:
                current = description

        current(token, action)

    return writer


def mesure_writer() -> Callable:
    """Returns a closure to keep track of current writer function. Also scope mesure related functions."""

    def head(token: BlockToken, mesure: dict) -> None:
        """save h1 into mesure"""
        if isinstance(token, Heading) and token.level == 1:
            mesure['nom'] = token.children[0].content

    def description(token: BlockToken, mesure: dict) -> None:
        """Save description as an HTML string"""
        if is_keyword(token, 'description'):
            return
        if 'description' not in mesure.keys():
            mesure['description'] = ''
        mesure['description'] += token_to_string(token)

    actions = actions_writer()

    current: Callable = head

    def writer(token: BlockToken, mesure: dict) -> None:
        nonlocal current
        if current is head and is_yaml(token):
            current = meta
        elif current is meta:
            current = void
        if is_keyword(token, 'description'):
            current = description
        if is_keyword(token, 'actions'):
            current = actions
        current(token, mesure)

    return writer


def build_mesure(doc: Document) -> dict:
    """Extract mesures from markdown AST"""
    mesure = {}
    writer = mesure_writer()

    for token in doc.children:
        writer(token, mesure)

    return mesure


def render_mesure_as_js(mesure: dict,
                        template_file='referentiels/js/mesure_citergie.j2') -> str:  # pragma: no cover
    env = build_jinja_environment()
    template = env.get_template(template_file)
    rendered = template.render(mesure=mesure)
    return jsbeautifier.beautify(rendered)


def filter_indicateurs_by_mesure_id(indicateurs: List[dict], mesure_id: str) -> List[dict]:
    return [indicateur for indicateur in indicateurs if mesure_id in indicateur['mesures']]


def render_mesure_as_html(mesure: dict,
                          indicateurs: List[dict] = None,
                          template_file='referentiels/html/mesure_citergie.j2') -> str:
    env = build_jinja_environment()
    template = env.get_template(template_file)

    years = range(2016, 2023)

    if indicateurs is None:
        indicateurs = []

    # todo since those names are shared, use code generation.
    avancement_noms = {
        'faite': 'Faite',
        'programmee': 'Programmée',
        'pas_faite': 'Pas faite',
        'non_concerne': 'Non concerné',
    }
    rendered = template.render(mesure=mesure, avancement_noms=avancement_noms, indicateurs=indicateurs, years=years)
    soup = BeautifulSoup(rendered, 'html.parser')
    return soup.prettify()


def render_mesures_summary_as_html(mesures: List[dict],
                                   template_file='referentiels/html/mesures_summary_citergie.j2') -> str:
    """Renders mesures summmary into a single html string"""
    env = build_jinja_environment()
    template = env.get_template(template_file)
    thematiques = get_thematiques()
    by_theme = {}

    for mesure in mesures:
        theme = mesure['climat_pratic_id'].strip() if 'climat_pratic_id' in mesure.keys() else ''
        theme = theme if theme else 'Pas de thème'
        if theme not in by_theme.keys():
            by_theme[theme] = []
        by_theme[theme].append(mesure)

    rendered = template.render(mesures=by_theme, thematiques=thematiques)
    soup = BeautifulSoup(rendered, 'html.parser')
    return soup.prettify()


def render_mesure_as_json(mesure: dict) -> str:  # pragma: no cover
    return json.dumps(mesure, indent=4)

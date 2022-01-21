from __future__ import annotations
from typing import Callable, List, Optional

from tqdm import tqdm

from business.referentiel.domain.models.action_children import ActionChildren
from business.referentiel.domain.models.action_computed_point import ActionComputedPoint
from business.referentiel.domain.models.action_definition import ActionId
from business.utils.timeit import timeit


class ActionTreeError(Exception):
    pass


def flatten_list(l: List) -> List:
    return [item for sublist in l for item in sublist]


class ActionTree:
    def __init__(self, actions_children: List[ActionChildren]) -> None:

        self.children_ids_by_action_id = {
            action_children.action_id: action_children.children
            for action_children in actions_children
        }

        self._backward_ids = self._build_backward_ids_from_children_ids_by_action_id()

        self._forward_ids = self._backward_ids[::-1]

        self._tache_ids = self._build_tache_ids()

    # def get_action_point(self, action_id: ActionId) -> float:
    #     return self._points_by_id[action_id]

    def get_children(self, action_id: ActionId) -> List[ActionId]:
        return self.children_ids_by_action_id.get(action_id, [])

    def get_siblings(self, action_id: ActionId) -> List[ActionId]:
        action_parent = [
            parent_id
            for parent_id, children in self.children_ids_by_action_id.items()
            if action_id in children
        ]
        return self.get_children(action_parent[0]) if action_parent else []

    @timeit("map on taches")
    def map_on_taches(self, callback: Callable[[ActionId], None]):
        for tache_id in tqdm(self._tache_ids):
            callback(tache_id)

    @timeit("map from sous actions to root")
    def map_from_sous_actions_to_root(self, callback: Callable[[ActionId], None]):
        for action_id in tqdm(self._backward_ids):
            if action_id not in self._tache_ids:
                callback(action_id)

    @timeit("map from taches to root")
    def map_from_taches_to_root(self, callback: Callable[[ActionId], None]):
        for action_id in tqdm(self._backward_ids):
            callback(action_id)

    @timeit("map from actions to taches")
    def map_from_action_to_taches(
        self, callback: Callable[[ActionId], None], action_depth: int
    ):
        for action_id in tqdm(self._forward_ids):
            this_depth = self.infer_depth(action_id)
            if this_depth >= action_depth:
                callback(action_id)

    # def infer_depth(self, action_id: ActionId):
    # children_ids = self.children_ids_by_action_id.get(action_id)
    # if not children_ids:
    #     return 0
    # return 1 + max([self.infer_depth(child_id) for child_id in children_ids])

    def infer_depth(self, action_id: ActionId):
        parent_id = self._get_parent(action_id)
        if not parent_id:
            return 0
        return 1 + self.infer_depth(parent_id)

    def _get_parent(self, action_id: ActionId) -> Optional[ActionId]:
        return next(
            (
                parent_id
                for parent_id in self.children_ids_by_action_id
                if action_id in self.get_children(parent_id)
            ),
            None,
        )

    @property
    def forward_ids(self):
        return self._forward_ids

    @property
    def backward_ids(self):
        return self._forward_ids[::-1]

    def _is_leaf(self, action_id: ActionId):
        return self.get_children(action_id) == []

    def _build_tache_ids(self) -> List[ActionId]:
        tache_ids = []
        for action_id in self._backward_ids:
            if self._is_leaf(action_id):
                tache_ids.append(action_id)
        return tache_ids

    def _build_backward_ids_from_children_ids_by_action_id(self) -> List[ActionId]:

        action_ids = list(
            set(
                flatten(list(self.children_ids_by_action_id.values()))
                + list(self.children_ids_by_action_id.keys())
            )
        )

        return sorted(
            action_ids,
            key=lambda action_id: self.infer_depth(action_id),
            reverse=True,
        )


def flatten(L: List[List]):
    return [item for sublist in L for item in sublist]
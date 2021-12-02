from typing import Any, Type, List

from business.core.domain.ports.domain_message_bus import (
    AbstractDomainMessageBus,
)
from business.core.domain.models.event import DomainEvent


def spy_on_event(
    event_bus: AbstractDomainMessageBus, event_type: Type[DomainEvent]
) -> List[Any]:
    published_events = []

    def spy(e):
        published_events.append(e)

    event_bus.subscribe_to_event(event_type, spy)
    return published_events
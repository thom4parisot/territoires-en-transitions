from business.core.domain.ports.domain_message_bus import (
    InMemoryDomainMessageBus,
)


# TODO !
def test_domain_event_published_on_replay_correct_realtime_status_update_observer():
    bus = InMemoryDomainMessageBus()
    # converters: List[AbstractConverter] = [EpciActionStatutUpdateConverter()]
    # socket = get_conn
    # realtime = SupabaseRealtime(bus, converters=converters, socket=socket)

    # Mock INSERT in SupaBase socket = lyon, eci

    # realtime.set_events_to_emit(
    #     [
    #         {
    #             "record": {
    #                 "referentiel": "eci",
    #                 "epci_id": "lyon",
    #             },
    #             "table": "epci_action_statut_update",
    #         }
    #     ]
    # )
    # failure_events = spy_on_event(bus, events.RealtimeEventWithWrongFormatObserved)
    # corresponding_domain_events = spy_on_event(bus, events.ActionStatutUpdatedForEpci)

    # realtime.start()

    # assert len(failure_events) == 0
    # assert len(corresponding_domain_events) == 1
    # assert corresponding_domain_events[0] == events.ActionStatutUpdatedForEpci(
    #     epci_id="lyon", referentiel="eci", created_at="2020-01-01"
    # )

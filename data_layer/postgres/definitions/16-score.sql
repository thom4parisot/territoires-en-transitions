--------------------------------
----------- SCORE --------------
--------------------------------
create table score
(
    -- id                     serial primary key,
    collectivite_id        integer references collectivite        not null,
    action_id              action_id references action_relation   not null,
    points                 real,
    potentiel              real                                   not null,
    referentiel_points     real                                   not null,
    concerne               bool                                   not null,
    previsionnel           real,
    total_taches_count     int                                    not null,
    completed_taches_count int                                    not null,
    created_at             timestamp with time zone default Now() not null,
    processed              boolean                  default false not null,
    primary key (collectivite_id, action_id)
);

comment on table score is
    'Score data is created only by the business. The client uses client_scores table';
comment on column score.created_at is
    'Used to group scores in batches because rows created during a transaction have the same values';

alter table score
    enable row level security;

create policy allow_read
    -- score is not used by the client, however we allow read for debugging purposes.
    on score
    for select
    using (is_any_role_on(collectivite_id));

create table client_scores
(
    -- id               serial primary key,
    collectivite_id  integer references collectivite not null,
    referentiel      referentiel                     not null,
    scores           json                            not null,
    score_created_at timestamp with time zone        not null,
    primary key (collectivite_id, referentiel)
);
comment on table client_scores is
    'Client score data is generated from score after the batch is inserted';
comment on column client_scores.score_created_at is
    'Equal score.created_at.';

alter table client_scores
    enable row level security;

create policy allow_read
    on client_scores
    for select
    using (is_any_role_on(collectivite_id));


--------------------------------
---------- PROCESSING ----------
--------------------------------
create or replace function
    get_score_batches_for_epci(
    collectivite_id integer
)
    returns table
            (
                collectivite_id int,
                referentiel     referentiel,
                scores          json,
                created_at      timestamptz
            )
as
$$
select score.collectivite_id,
       action_relation.referentiel,
       json_agg(
               json_build_object(
                       'action_id', action_id,
                       'points', points,
                       'potentiel', potentiel,

                        -- todo if the business could insert the referentiel we wouldn't need a join
                       'referentiel', action_relation.referentiel,

                       'referentiel_points', referentiel_points,
                       'concerne', concerne,
                       'previsionnel', previsionnel,
                       'total_taches_count', total_taches_count,
                       'completed_taches_count', completed_taches_count
                   )
           ) as scores,
       max(created_at)
from score
         join action_relation on
    action_id = action_relation.id
where score.collectivite_id = $1
group by score.collectivite_id, action_relation.referentiel;
$$ language sql;
comment on function get_score_batches_for_epci is
    'group scores into json batches';


create or replace function insert_client_scores_for_collectivite(
    id integer
) returns void as
$$
begin
    -- remove existing client scores
    delete from client_scores where collectivite_id = id;
    -- insert client scores
    insert into client_scores (collectivite_id, referentiel, scores, score_created_at)
    select batches.collectivite_id,
           batches.referentiel,
           batches.scores,
           batches.created_at
    from get_score_batches_for_epci(id) as batches;
end;
$$ language plpgsql;
comment on function insert_client_scores_for_collectivite is
    'Called by the business after all scores are inserted to build a scores client representation.';


create view unprocessed_action_statut_update_event
as
select action_statut_update_event.collectivite_id, referentiel, created_at
from action_statut_update_event
         join (
    select collectivite_id, max(created_at) as date
    from score
    group by collectivite_id
)
    as latest_epci_score on action_statut_update_event.collectivite_id = latest_epci_score.collectivite_id
where action_statut_update_event.created_at > latest_epci_score.date;
comment on view unprocessed_action_statut_update_event is
    'To be used by business to compute only what is necessary on wake up.';

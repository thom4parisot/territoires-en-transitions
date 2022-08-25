-- Deploy tet:referentiel/contenu_preuve_v2 to pg

BEGIN;
-- Drop functions and views depending on table action_definition  
drop function action_preuve; 
drop function business_insert_actions; 
drop function business_update_actions; 
drop function labellisation_parcours; 
drop function referentiel_down_to_action;
drop function action_down_to_tache; 

drop view unprocessed_action_statut_update_event; 
drop view action_statuts; 
drop view action_title; 
drop view action_definition_summary; 

-- drop column 'preuve'
alter table action_definition drop column preuve; 

-- update functions and views depending on table action_definition  
create function business_insert_actions(
    relations action_relation[],
    definitions action_definition[],
    computed_points action_computed_points[]
) returns void as
$$
declare
    rel action_relation;
    def action_definition;
    pts action_computed_points;
begin
    if is_service_role()
    then
        -- insert relations
        foreach rel in array business_insert_actions.relations
            loop
                insert into action_relation(id, referentiel, parent)
                values(rel.id, rel.referentiel, rel.parent);
            end loop;
        -- insert definitions
        foreach def in array business_insert_actions.definitions
            loop
                insert into action_definition(action_id, referentiel, identifiant, nom, description, contexte, exemples, ressources,  perimetre_evaluation, reduction_potentiel,
                                              points, pourcentage, categorie)
                values(def.action_id, def.referentiel, def.identifiant, def.nom, def.description, def.contexte, def.exemples, def.ressources, def. perimetre_evaluation, def.reduction_potentiel,
                       def.points, def.pourcentage, def.categorie);
            end loop;
        -- insert computed points
        foreach pts in array business_insert_actions.computed_points
            loop
                insert into action_computed_points(action_id, value) values(pts.action_id, pts.value);
            end loop;
    else
        perform set_config('response.status', '401', true);
    end if;
end;
$$ language plpgsql;
comment on function business_insert_actions is
    'Insert les definitions des actions, les enfants et les points calculés par le business';


create function business_update_actions(
    definitions action_definition[],
    computed_points action_computed_points[]
) returns void as
$$
declare
    def action_definition;
    pts action_computed_points;
begin
    if is_service_role()
    then
        -- update definitions
        foreach def in array business_update_actions.definitions
            loop
                update action_definition
                set referentiel = def.referentiel,
                    identifiant = def.identifiant,
                    nom         = def.nom,
                    description = def.description,
                    contexte    = def.contexte,
                    exemples    = def.exemples,
                    ressources  = def.ressources,
                    perimetre_evaluation = def.perimetre_evaluation,
                    reduction_potentiel = def.reduction_potentiel,
                    points      = def.points,
                    pourcentage = def.pourcentage,
                    categorie = def.categorie
                where action_id = def.action_id;
            end loop;
        -- update computed points
        foreach pts in array business_update_actions.computed_points
            loop
                update action_computed_points
                set value = pts.value
                where action_id = pts.action_id;
            end loop;
    else
        perform set_config('response.status', '401', true);
    end if;
end;
$$ language plpgsql;
comment on function business_update_actions is
    'Update existing action definitions and computed points';



create or replace view action_definition_summary
as
select id,
       action_definition.referentiel,
       action_children.children,
       action_children.depth,
       coalesce(
               case
                   when referentiel = 'cae'
                       then ('{"axe", "sous-axe", "action", "sous-action", "tache"}'::action_type[])[action_children.depth]
                   else ('{"axe", "action", "sous-action", "tache"}'::action_type[])[action_children.depth]
                   end
           , 'referentiel') as type,
       identifiant,
       nom,
       description,
       exemples != '' as have_exemples,
       ressources != '' as have_ressources,
       reduction_potentiel != '' as have_reduction_potentiel,
       perimetre_evaluation != '' as have_perimetre_evaluation,
       contexte != '' as have_contexte,
       id in (select action_id from question_action ) as have_questions
from action_definition
         join action_children on action_id = action_children.id
order by naturalsort(action_id);
comment on view action_definition_summary is
    'The minimum information to display an action';




create or replace view action_statuts
as
select
    -- client will filter on:
    c.id                                                                   as collectivite_id,
    d.action_id,
    d.referentiel,
    h.type,
    h.descendants,
    h.ascendants,
    h.depth,
    h.have_children,

    -- and optionally retrieve:
    d.identifiant,
    d.nom,
    d.description,
    d.exemples != ''                                                       as have_exemples,
    d.ressources != ''                                                     as have_ressources,
    d.reduction_potentiel != ''                                            as have_reduction_potentiel,
    d.perimetre_evaluation != ''                                           as have_perimetre_evaluation,
    d.contexte != ''                                                       as have_contexte,
    d.categorie                                                            as phase,

    -- score [0.0, 1.0]
    case
        when sc.point_potentiel = 0 then 0
        else sc.point_fait / sc.point_potentiel end                        as score_realise,
    case
        when sc.point_potentiel = 0 then 0
        else sc.point_programme / sc.point_potentiel end                   as score_programme,
    case
        when sc.point_potentiel = 0 then 0
        else (sc.point_fait + sc.point_programme) / sc.point_potentiel end as score_realise_plus_programme,
    case
        when sc.point_potentiel = 0 then 0
        else sc.point_pas_fait / sc.point_potentiel end                    as score_pas_fait,
    case
        when sc.point_potentiel = 0 then 0
        else sc.point_non_renseigne / sc.point_potentiel end               as score_non_renseigne,

    -- points
    sc.point_potentiel - sc.point_fait                                     as points_restants,
    sc.point_fait                                                          as points_realises,
    sc.point_programme                                                     as points_programmes,
    sc.point_potentiel                                                     as points_max_personnalises,
    sc.point_referentiel                                                   as points_max_referentiel,

    -- action statuts
    s.avancement,
    s.avancement_detaille,

    -- children status: the set of statuts of all children
    cs.avancements                                                         as avancement_descendants,
    coalesce((not s.concerne), cs.non_concerne, false)                     as non_concerne

from collectivite c
         -- definitions
         left join action_definition d on true
         join action_hierarchy h on d.action_id = h.action_id
    -- collectivité data
         left join action_statut s on c.id = s.collectivite_id and s.action_id = d.action_id
         left join private.action_scores sc on c.id = sc.collectivite_id and sc.action_id = d.action_id
    -- loop on every row to aggregate descendants statuts
         left join lateral (
    select case
               -- aucun descendant
               when not h.have_children then
                   '{}'::avancement[]
               -- aucun statut pour les enfants
               when sc.point_non_renseigne = sc.point_potentiel then
                   '{non_renseigne}'::avancement[]
               -- des statuts mais pas pour chaque enfant
               when sc.point_non_renseigne > 0.0 then
                       '{non_renseigne}'::avancement[] ||
                       array_agg(distinct statut.avancement) filter ( where statut.concerne )
               -- des statuts pour chaque enfant
               else
                   array_agg(distinct statut.avancement) filter ( where statut.concerne )
               end
               as avancements,
           not bool_and(statut.concerne)
               as non_concerne
    from action_statut statut
    where c.id = statut.collectivite_id
      and statut.action_id = any (h.leaves)
    ) cs on true
-- remove `desactive` and `non concernes` in one fell swoop.
where sc is null
   or (sc.concerne and not sc.desactive)
order by c.id,
         naturalsort(d.identifiant);


-- unchanged functions and views depending on table action_definition  
create or replace view action_title
as
select id,
       referentiel,
       children,
       type,
       identifiant,
       nom
from action_definition_summary;
comment on view action_title is
    'Titles only';


create or replace function referentiel_down_to_action(
    referentiel referentiel
)
    returns setof action_definition_summary as
$$
declare
    referentiel_action_depth integer;
begin
    if referentiel_down_to_action.referentiel = 'cae'
    then
        select 3 into referentiel_action_depth;
    else
        select 2 into referentiel_action_depth;
    end if;
    return query
        select *
        from action_definition_summary
        where action_definition_summary.referentiel = referentiel_down_to_action.referentiel
          and action_definition_summary.depth <= referentiel_action_depth;
end;
$$ language plpgsql;
comment on function referentiel_down_to_action is 'Returns referentiel action summary down to the action level';


create or replace function action_down_to_tache(
    referentiel referentiel,
    identifiant text
)
    returns setof action_definition_summary as
$$
declare
    referentiel_action_depth integer;
begin
    if action_down_to_tache.referentiel = 'cae'
    then
        select 3 into referentiel_action_depth;
    else
        select 2 into referentiel_action_depth;
    end if;
    return query
        select *
        from action_definition_summary
        where action_definition_summary.referentiel = action_down_to_tache.referentiel
          and action_definition_summary.identifiant like action_down_to_tache.identifiant || '%'
          and action_definition_summary.depth >= referentiel_action_depth - 1;
end
$$ language plpgsql;
comment on function action_down_to_tache is 'Returns referentiel action summary down to the tache level';


create or replace view unprocessed_action_statut_update_event
as
with
    -- active collectivite
    unique_collectivite_droit as (
        select collectivite_id, min(created_at) as max_date
        from private_utilisateur_droit
        where active
        group by collectivite_id
    ),
    -- cross join active collectivite with (eci, cae)
    activation_updates as (
        select collectivite_id,
               unnest('{eci, cae}'::referentiel[]) as referentiel,
               max_date as updated_at
        from unique_collectivite_droit
    ),
    -- update on statuses per collectivite and referentiel
    statut_updates as (
        select collectivite_id, max(modified_at) as updated_at, referentiel
        from action_statut left join action_definition_summary on action_statut.action_id = action_definition_summary.id
        group by (collectivite_id, referentiel)
    ),
    -- update on referentiel computed points 
    referentiels_last_update as (
        select  referentiel, max(modified_at) as updated_at
        from action_computed_points acp
        left join action_relation ar on ar.id = acp.action_id
        group by (referentiel)
      ),
    referentiels_updates as (
        select referentiel, updated_at, collectivite_id
        from referentiels_last_update inner join private_utilisateur_droit on 1 = 1),
    -- vertical join of all update that would require to re-calculate the scores 
    all_updates as (
      select collectivite_id,
                  referentiel,
                  updated_at
      from activation_updates a
                full join statut_updates using (collectivite_id, referentiel, updated_at)
                full join referentiels_updates using (collectivite_id, referentiel, updated_at)
    ),
    -- last update per referentiel, per collectivite, that would require re-calculate the scores
    latest_updates as (
      select collectivite_id,
             referentiel,
             max(updated_at) as updated_at
      from all_updates
      group by collectivite_id, referentiel
    ),
    -- last scores calculation date  
    latest_client_scores as (
       select collectivite_id,
             referentiel,
             max(score_created_at) as score_created_at
        from client_scores 
        group by (collectivite_id, referentiel)
    )
    -- filter updates that happened after the last score update (for collectivite and referentiel)
    select collectivite_id, referentiel, updated_at::timestamp as created_at from latest_updates
    left join latest_client_scores using (referentiel, collectivite_id)
    where score_created_at is null or updated_at > score_created_at;

comment on view unprocessed_action_statut_update_event is
    'To be used by business to compute only what is necessary.';


create or replace function
    labellisation_parcours(collectivite_id integer)
    returns table
            (
                referentiel            referentiel,
                etoiles                labellisation.etoile,
                completude_ok          boolean,
                critere_score          jsonb,
                criteres_action        jsonb,
                rempli                 boolean,
                calendrier             text,
                derniere_demande       jsonb,
                derniere_labellisation jsonb
            )
as
$$
with etoiles as (select *
                 from labellisation.etoiles(labellisation_parcours.collectivite_id)),
     all_critere as (select *
                     from labellisation.critere_action(labellisation_parcours.collectivite_id)),
     -- les critères pour l'étoile visée et les précédentes.
     current_critere as (select c.*
                         from all_critere c
                                  join etoiles e on e.referentiel = c.referentiel and e.etoile_objectif >= c.etoiles),
     criteres as (select *
                  from (select c.referentiel,
                               bool_and(c.atteint) as atteints,
                               jsonb_agg(
                                       jsonb_build_object(
                                               'formulation', formulation,
                                               'prio', c.prio,
                                               'action_id', c.action_id,
                                               'rempli', c.atteint,
                                               'etoile', c.etoiles,
                                               'action_identifiant', ad.identifiant,
                                               'statut_ou_score',
                                               case
                                                   when c.min_score_realise = 100 and c.min_score_programme is null
                                                       then 'Fait'
                                                   when c.min_score_realise = 100 and c.min_score_programme = 100
                                                       then 'Programmé ou fait'
                                                   when c.min_score_realise is not null and c.min_score_programme is null
                                                       then c.min_score_realise || '% fait minimum'
                                                   else c.min_score_realise || '% fait minimum ou ' ||
                                                        c.min_score_programme || '% programmé minimum'
                                                   end
                                           )
                                   )               as liste
                        from current_critere c
                                 join action_definition ad on c.action_id = ad.action_id
                        group by c.referentiel) ral)
select e.referentiel,
       e.etoile_objectif,
       rs.complet                                      as completude_ok,

       jsonb_build_object(
               'score_a_realiser', cs.score_a_realiser,
               'score_fait', cs.score_fait,
               'atteint', cs.atteint,
               'etoiles', cs.etoile_objectif)          as critere_score,

       criteres.liste                                  as criteres_action,
       criteres.atteints and cs.atteint and cf.atteint as rempli,
       calendrier.information,

       case
           when demande.etoiles is null
               then null
           else jsonb_build_object('demandee_le', demande.date, 'etoiles', demande.etoiles)
           end                                         as derniere_demande,

       case
           when obtention.etoiles is null
               then null
           else jsonb_build_object('obtenue_le', obtention.date, 'etoiles', obtention.etoiles)
           end                                         as derniere_labellisation

from etoiles as e
         join criteres on criteres.referentiel = e.referentiel
         left join labellisation.referentiel_score(labellisation_parcours.collectivite_id) rs
                   on rs.referentiel = e.referentiel
         left join labellisation.critere_score_global(labellisation_parcours.collectivite_id) cs
                   on cs.referentiel = e.referentiel
         left join labellisation.critere_fichier(labellisation_parcours.collectivite_id) cf
                   on cf.referentiel = e.referentiel
         left join labellisation_calendrier calendrier
                   on calendrier.referentiel = e.referentiel
         left join lateral (select ld.date, ld.etoiles
                            from labellisation.demande ld
                            where ld.collectivite_id = labellisation_parcours.collectivite_id
                              and ld.referentiel = e.referentiel
                              and ld.etoiles = e.etoile_objectif) demande on true
         left join lateral (select l.obtenue_le as date, l.etoiles
                            from labellisation l
                            where l.collectivite_id = labellisation_parcours.collectivite_id
                              and l.referentiel = e.referentiel) obtention on true
$$
    language sql security definer;
comment on function labellisation_parcours is
    'Renvoie le parcours de labellisation de chaque référentiel pour une collectivité donnée.';


-- create table preuve_reglementaire_definition 
create domain preuve_id as varchar(30);
create table preuve_reglementaire_definition
(
    id              preuve_id primary key,
    action_id       action_id references action_relation,
    nom             text not null,
    description     text not null

);
comment on table preuve_reglementaire_definition is
        'Définition des preuve règlementaire liée à des actions';

alter table preuve_reglementaire_definition
    enable row level security;

create policy allow_read
    on preuve_reglementaire_definition
    for select
    using (true);

create function business_upsert_preuves(
    preuve_definitions preuve_reglementaire_definition[]
) returns void as
$$
declare
    def preuve_reglementaire_definition;
begin
    if is_service_role()
    then
        -- upsert definitions
        foreach def in array business_upsert_preuves.preuve_definitions
            loop
                insert into preuve_reglementaire_definition
                values (
                        def.id,
                        def.action_id,
                        def.nom,
                        def.description)
                on conflict (id)
                    do update set action_id  = def.action_id,
                                  nom       = def.nom,
                                  description       = def.description;
                -- delete old definitions
                delete
                from preuve_reglementaire_definition
                where id = def.id;
            end loop;
    else
        perform set_config('response.status', '401', true);
    end if;
end
$$ language plpgsql;
comment on function business_upsert_preuves is
    'Met à jour les définitions des preuves réglementaires';

COMMIT;


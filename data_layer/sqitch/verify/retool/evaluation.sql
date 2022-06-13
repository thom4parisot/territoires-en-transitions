-- Verify tet:retool/evaluation on pg

BEGIN;

select collectivite_id, nom, completude_eci, completude_cae
from retool_completude_compute
where false;

select collectivite_id,
       collectivité,
       referentiel,
       action,
       avancement,
       points,
       points_potentiels,
       pourcentage,
       commentaire
from retool_score
where false;

select collectivite_id,
       nom,
       region_name,
       departement_name,
       type_collectivite,
       population_totale,
       code_siren_insee,
       completude_eci,
       completude_cae
from retool_completude
where false;

ROLLBACK;

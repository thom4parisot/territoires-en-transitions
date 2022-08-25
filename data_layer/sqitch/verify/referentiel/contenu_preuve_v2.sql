-- Verify tet:referentiel/contenu_preuve_v2 on pg

BEGIN;

select id, action_id, nom, description
from preuve_reglementaire_definition
where false;

select has_function_privilege('business_upsert_preuves(preuve_reglementaire_definition[])', 'execute');

ROLLBACK;

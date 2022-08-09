-- Deploy tet:evaluation/seuils_de_population to pg

BEGIN;

create or replace function private.population_buckets(population integer)
    returns text[]
as
$$
select case
           when population < 5000   then '{"moins_de_5000", "moins_de_10000", "moins_de_50000", "moins_de_100000"}'
           when population < 10000  then '{"moins_de_10000", "moins_de_20000", "moins_de_100000"}'
           when population < 20000  then '{"moins_de_20000", "moins_de_100000"}'
           when population < 100000 then '{"moins_de_100000"}'
           when population > 100000 then '{"plus_de_100000"}'
           else '{}'
           end::text[]
$$ language sql stable;
comment on function private.population_buckets is
    'Renvoie un tableau de valeurs représentant les seuils de population '
        'utilisés par le business pour la personnalisation des référentiels.';

COMMIT;

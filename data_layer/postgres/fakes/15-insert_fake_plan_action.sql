insert into indicateur_definition
values (default,
        'ind0',
        'cae',
        'r',
        null,
        'Radioactivité',
        'description',
        'sv',
        true,
        null);

insert into indicateur_personnalise_definition
values (default,
        1,
        1,
        'Voltage',
        'Tension',
        'V',
        'commentaire',
        '17440546-f389-4d4f-bfdb-b0c94a1bd0f9');

insert into fiche_action
(collectivite_id,
 uid,
 avancement,
 numerotation,
 titre,
 description,
 structure_pilote,
 personne_referente,
 elu_referent,
 partenaires,
 budget_global,
 commentaire,
 date_fin,
 date_debut,
 action_ids,
 indicateur_ids,
 indicateur_personnalise_ids)
values (1,
        '17440546-f389-4d4f-bfdb-b0c94a1bd0f9',
        'pas_fait',
        'A0',
        'titre',
        'description',
        'pilote',
        'référente',
        'référent',
        'partenaires',
        '€',
        'commentaire',
        'fin',
        'début',
        array ['cae']::action_id[],
        array ['ind0']::indicateur_id[],
        array [1]::integer[]);

insert into plan_action
(collectivite_id,
 uid,
 nom,
 categories,
 fiches_by_category)
values (1,
        'plan_collectivite',
        'Plan d''actions de la collectivité',
        '[
          {
            "nom": "1. Yolo",
            "uid": "ef599348-6ab9-4dc7-bf62-41b9a17ea5fa"
          }
        ]',
        '[
          {
            "fiche_uid": "17440546-f389-4d4f-bfdb-b0c94a1bd0f9",
            "category_uid": "ef599348-6ab9-4dc7-bf62-41b9a17ea5fa"
          }
        ]');

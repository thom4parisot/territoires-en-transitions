/// <reference types="Cypress" />

When(
  /l'état d'avancement de l'action "([^"]+)" pour la collectivité "(\d+)" est réinitialisé/,
  (action_id, collectivite_id) => {
    // on utilise ici un reset "hard" directement dans la base en attendant de
    // disposer d'un appel RPC pour le faire de manière un peu plus "propre"
    // (Ref: https://github.com/betagouv/territoires-en-transitions/issues/1572)
    cy.task('pg_query', {
      query:
        'DELETE FROM action_statut WHERE collectivite_id = $1 AND action_id LIKE $2',
      values: [collectivite_id, action_id],
    });
  }
);

When("aucun score n'est affiché", () => {
  cy.get('[data-test^=score-]').should('not.exist');
});

/*
When('tous les scores sont à 0', () => {
  cy.get('[data-test^=score-]').each((el) =>
    cy.wrap(el).should('have.text', '0 %')
  );
});
*/

When('les scores sont affichés avec les valeurs suivantes :', (dataTable) => {
  cy.wrap(dataTable.rows()).each(([action, score]) => {
    cy.get(`[data-test="score-${action}"]`).should('have.text', score);
  });
});

When(
  /j'assigne la valeur "([^"]+)" à l'état d'avancement de la tâche "([^"]+)"/,
  (avancement, tache) => {
    // ouvre le composant Select
    cy.get(`[data-test="task-${tache}"]`).click();
    // et sélectionne l'option voulue
    cy.get(
      `.MuiPopover-root [role=option][data-value=${avancementToValue[avancement]}]`
    ).click();
  }
);

const avancementToValue = {
  'Non renseigné': -1,
  Fait: 1,
  Programmé: 2,
  'Pas fait': 3,
  Détaillé: 4,
  'Non concerné': 5,
};
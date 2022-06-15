/// <reference types="Cypress" />

import { LocalSelectors } from './selectors';

beforeEach(() => {
  // enregistre les définitions locales
  cy.wrap(LocalSelectors).as('LocalSelectors');
});

Given(/la page contient (\d+) collectivités?/, (count) => {
  cy.get('.collectiviteCard').should('have.length', count);
});

Given('je désactive tous les filtres', () => {
  cy.get(LocalSelectors['bouton Désactiver tous les filtres'].selector).click();
});

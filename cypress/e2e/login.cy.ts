import { fakeJwt } from '../support/fakeJwt';

describe('Connexion', () => {
  it('connecte l\'utilisateur avec des identifiants valides et affiche son nom dans le header', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: fakeJwt('jdoe') } }).as('login');

    cy.visit('/login');
    cy.get('input[formcontrolname="login"]').type('jdoe');
    cy.get('input[formcontrolname="password"]').type('secret');
    cy.contains('button', 'Login').click();

    cy.wait('@login');
    cy.location('pathname').should('eq', '/');
    cy.contains('jdoe').should('be.visible');
  });

  it('affiche un message d\'erreur avec un mauvais mot de passe et ne redirige pas', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401 }).as('login');

    cy.visit('/login');
    cy.get('input[formcontrolname="login"]').type('jdoe');
    cy.get('input[formcontrolname="password"]').type('wrong');
    cy.contains('button', 'Login').click();

    cy.wait('@login');
    cy.contains('Login ou mot de passe incorrect').should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });
});

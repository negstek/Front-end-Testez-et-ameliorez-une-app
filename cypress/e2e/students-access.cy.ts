describe('Accès à la liste des étudiants', () => {
  it('redirige un visiteur non connecté vers /login (authGuard)', () => {
    cy.visit('/students');

    cy.location('pathname').should('eq', '/login');
  });
});

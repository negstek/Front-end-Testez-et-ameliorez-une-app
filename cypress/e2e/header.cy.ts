describe('Header', () => {
  it('déconnecte l\'utilisateur depuis le menu et revient à un état déconnecté', () => {
    cy.visitAsLoggedIn('/', 'jdoe');

    cy.get('button').contains('jdoe').click();
    cy.contains('button', 'Déconnexion').click();

    cy.location('pathname').should('eq', '/');
    cy.contains('a', 'Se connecter').should('be.visible');
  });
});

describe('Accueil', () => {
  it('affiche un message générique et le lien de connexion pour un visiteur non connecté', () => {
    cy.visit('/');

    cy.contains('Connectez-vous pour accéder à votre espace').should('be.visible');
    cy.contains('a', 'Se connecter').should('be.visible');
  });

  it('affiche un message personnalisé pour un utilisateur déjà connecté', () => {
    cy.visitAsLoggedIn('/', 'jdoe');

    cy.contains('Bienvenue, jdoe !').should('be.visible');
  });
});

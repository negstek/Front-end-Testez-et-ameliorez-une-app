describe('Inscription', () => {
  it('crée un compte avec des informations valides et redirige vers la connexion', () => {
    cy.intercept('POST', '/api/register', { statusCode: 200, body: {} }).as('register');

    cy.visit('/register');
    cy.get('input[formcontrolname="firstName"]').type('Ada');
    cy.get('input[formcontrolname="lastName"]').type('Lovelace');
    cy.get('input[formcontrolname="login"]').type('ada');
    cy.get('input[formcontrolname="password"]').type('secret');
    cy.contains('button', 'Register').click();

    cy.wait('@register');
    cy.contains('Compte créé avec succès').should('be.visible');
    cy.location('pathname').should('eq', '/login');
  });
});

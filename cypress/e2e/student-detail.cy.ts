describe('Détail d\'un étudiant', () => {
  it('affiche les informations de l\'étudiant demandé', () => {
    const student = { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('getStudent');

    cy.visitAsLoggedIn('/students/1', 'jdoe');
    cy.wait('@getStudent');

    cy.contains('dd', 'Ada').should('be.visible');
    cy.contains('dd', 'Lovelace').should('be.visible');
    cy.contains('dd', 'ada@example.com').should('be.visible');
  });
});

describe('Liste des étudiants', () => {
  it('affiche les étudiants renvoyés par le backend', () => {
    const students = [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' },
      { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', birthDate: '1912-06-23' },
    ];
    cy.intercept('GET', '/api/students', { statusCode: 200, body: students }).as('getStudents');

    cy.visitAsLoggedIn('/students', 'jdoe');
    cy.wait('@getStudents');

    cy.get('table tbody tr').should('have.length', 2);
    cy.contains('td', 'Ada').should('be.visible');
    cy.contains('td', 'Turing').should('be.visible');
  });
});

describe('Suppression d\'un étudiant', () => {
  it('supprime un étudiant et retire la ligne correspondante de la liste', () => {
    const students = [
      { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' },
      { id: 2, firstName: 'Alan', lastName: 'Turing', email: 'alan@example.com', birthDate: '1912-06-23' },
    ];
    cy.intercept('GET', '/api/students', { statusCode: 200, body: students }).as('getStudents');
    cy.intercept('DELETE', '/api/students/1', { statusCode: 200 }).as('deleteStudent');

    cy.visitAsLoggedIn('/students', 'jdoe');
    cy.wait('@getStudents');

    // Registered after the initial load so it only affects the reload triggered by the delete
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [students[1]] }).as('getStudentsAfterDelete');
    // window.confirm() is auto-accepted by Cypress by default, no stubbing needed
    cy.contains('tr', 'Ada').within(() => {
      cy.contains('button', 'Supprimer').click();
    });

    cy.wait('@deleteStudent');
    cy.wait('@getStudentsAfterDelete');
    cy.contains('td', 'Ada').should('not.exist');
    cy.contains('td', 'Turing').should('be.visible');
  });
});

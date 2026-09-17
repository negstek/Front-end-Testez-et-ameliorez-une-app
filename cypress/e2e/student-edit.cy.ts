describe('Édition d\'un étudiant', () => {
  it('met à jour un étudiant depuis la fiche et redirige vers la liste', () => {
    const student = { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' };
    cy.intercept('GET', '/api/students/1', { statusCode: 200, body: student }).as('getStudent');
    cy.intercept('PUT', '/api/students/1', { statusCode: 200, body: { ...student, lastName: 'King' } }).as('updateStudent');

    cy.visitAsLoggedIn('/students/1', 'jdoe');
    cy.wait('@getStudent');
    cy.contains('a', 'Modifier').click();

    cy.location('pathname').should('eq', '/students/1/edit');
    // StudentFormComponent fetches the student again to pre-fill the form in edit mode
    cy.wait('@getStudent');
    cy.get('input[formcontrolname="lastName"]').clear().type('King');
    cy.contains('button', 'Enregistrer').click();

    cy.wait('@updateStudent');
    cy.location('pathname').should('eq', '/students');
  });
});

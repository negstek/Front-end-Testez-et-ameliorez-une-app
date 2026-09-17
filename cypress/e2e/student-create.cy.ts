describe('Création d\'un étudiant', () => {
  it('crée un étudiant depuis la liste et redirige vers la liste', () => {
    cy.intercept('GET', '/api/students', { statusCode: 200, body: [] }).as('getStudents');
    cy.intercept('POST', '/api/students', {
      statusCode: 200,
      body: { id: 1, firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', birthDate: '1815-12-10' },
    }).as('createStudent');

    cy.visitAsLoggedIn('/students', 'jdoe');
    cy.wait('@getStudents');
    cy.contains('a', 'Ajouter un étudiant').click();

    cy.location('pathname').should('eq', '/students/new');
    cy.get('input[formcontrolname="firstName"]').type('Ada');
    cy.get('input[formcontrolname="lastName"]').type('Lovelace');
    cy.get('input[formcontrolname="email"]').type('ada@example.com');
    cy.get('input[formcontrolname="birthDate"]').type('1815-12-10');
    cy.contains('button', 'Ajouter').click();

    cy.wait('@createStudent');
    cy.location('pathname').should('eq', '/students');
  });
});

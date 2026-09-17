import { fakeJwt } from './fakeJwt';

// Seeds a JWT into localStorage before the Angular app boots, so UserService reads it as
// soon as it's constructed (see its constructor) — this simulates an already-connected user
// without having to drive the real login form first.
Cypress.Commands.add('visitAsLoggedIn', (url: string, username: string) => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem('jwt', fakeJwt(username));
    },
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      visitAsLoggedIn(url: string, username: string): Chainable<void>;
    }
  }
}

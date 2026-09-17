# EtudiantFrontend

[![Tests](https://github.com/negstek/Front-end-Testez-et-ameliorez-une-app/actions/workflows/tests.yml/badge.svg)](https://github.com/negstek/Front-end-Testez-et-ameliorez-une-app/actions/workflows/tests.yml)
[![E2E](https://github.com/negstek/Front-end-Testez-et-ameliorez-une-app/actions/workflows/e2e.yml/badge.svg)](https://github.com/negstek/Front-end-Testez-et-ameliorez-une-app/actions/workflows/e2e.yml)

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ------------------------ | -------------------------- | ------------------ |
| ![Statements](https://img.shields.io/badge/statements-100%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-100%25-brightgreen.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=flat) |

[Rapport de couverture détaillé](https://negstek.github.io/Front-end-Testez-et-ameliorez-une-app/)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit and integration tests with the [Jest](https://jestjs.io/) test runner, use the following command:

```bash
npm test
```

This runs the full suite (services, guards, interceptor, components and forms) with coverage. See [documentation/plan_tests.md](documentation/plan_tests.md) for the detailed list of cases (Étape 1).

## Running end-to-end tests

End-to-end tests use [Cypress](https://docs.cypress.io/), mocking every API call with `cy.intercept()`. See [documentation/plan_tests.md](documentation/plan_tests.md) for the detailed list of scenarios (Étape 2).

```bash
npm run e2e
```

Opens the Cypress interactive runner (requires `npm start` running in another terminal). To run the whole suite headlessly in one command (starts the dev server, runs the tests, then stops it):

```bash
npm run e2e:ci
```

`npm run e2e` is a shortcut for `npx cypress open`. From that interactive runner, [Cypress Studio](https://docs.cypress.io/app/guides/cypress-studio) (enabled via `experimentalStudio` in `cypress.config.ts`) lets you record clicks and typing directly in the browser and turn them into test code: open a spec, click "Add Commands to Test" (or right-click a step to add commands after it), interact with the page, then save — Cypress appends the generated commands to the spec file.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

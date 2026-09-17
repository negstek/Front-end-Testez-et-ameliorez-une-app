import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    // Lets Cypress Studio record clicks/typing into new or existing tests from the runner UI
    experimentalStudio: true,
  },
  video: false,
});

import { defineConfig } from "@playwright/test";

/**
 * Browser tests (tests/e2e/). They drive a real Chromium against the real app, so they
 * can prove things the HTTP tests in src/ cannot: that a whole journey works with
 * JavaScript off, and that it still works when the island scripts fail.
 *
 * Run with `npm run test:e2e`. The app is built and started for you, on its own port.
 */
const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    command: "npm run build && npm start",
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

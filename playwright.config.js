import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  use: { baseURL: "http://127.0.0.1:8779" },
  webServer: {
    command: "python3 -m http.server 8779 --bind 127.0.0.1 --directory dist",
    port: 8779,
    reuseExistingServer: false,
  },
  reporter: "list",
});

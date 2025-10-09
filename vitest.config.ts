import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,

    environment: "node",

    // Test file patterns
    include: ["**/*.{test,spec}.{ts,js}"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],

    testTimeout: 30000,

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "src/models/migrations/",
        "src/models/seeders/",
        "src/config/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.d.ts",
        "**/types/**",
        "server.ts",
        "coverage/**",
        "dist/**",
        "commitlint.config.js",
        "eslint.config.mjs",
        "vitest.config.ts",
      ],
      all: true,
      clean: true,
    },

    reporters: ["verbose"],

    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
});

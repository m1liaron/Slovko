import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/index.test.ts"],
    hookTimeout: 30000,
  },
});

const { resolve } = require("path");
const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "p5.capture",
      fileName: (format) => `p5.capture.${format}.js`,
      formats: ["umd"],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@/,
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "happy-dom",
  },
});

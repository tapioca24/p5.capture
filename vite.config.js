const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "p5.capture",
      fileName: (format) => `p5.capture.${format}.js`,
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
});

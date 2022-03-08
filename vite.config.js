const { resolve } = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "p5.capture",
      fileName: (format) => `p5.capture.${format}.js`,
    },
    rollupOptions: {
      output: {
        globals: {
          "https://unpkg.com/mp4-wasm@1.0.6": "loadMP4Module",
        },
      },
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

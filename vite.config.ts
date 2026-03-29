import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      entryRoot: "src",
      outDir: "dist",
      include: [
        "src/index.ts",
        "src/hooks/**/*.ts",
        "src/types/**/*.ts",
        "src/helpers/**/*.ts",
        "src/constants.ts",
      ],
      exclude: [
        "src/components/**/*",
        "src/App.tsx",
        "src/main.tsx",
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/vite-env.d.ts",
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "UsePlacesAutocomplete",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});

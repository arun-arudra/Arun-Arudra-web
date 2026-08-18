import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const normalizeBasePath = (basePath?: string) => {
  if (!basePath || basePath === "/") return "/";

  const trimmed = basePath.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH),

    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },

    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },

      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});

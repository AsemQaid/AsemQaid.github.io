// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://asemqaid.github.io",
  trailingSlash: "always",
  build: { format: "directory" },
});

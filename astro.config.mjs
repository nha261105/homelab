// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // Static site: every lesson × language is pre-rendered to plain HTML.
  output: "static",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  // ClientRouter turns prefetch on; hover is enough for a handful of tabs and tree links
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
});

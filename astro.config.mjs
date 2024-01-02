import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://duncan-f.github.io",
  integrations: [tailwind(), react(), sitemap(), partytown()],
  markdown: {
    //mode: 'mdx',
    remarkPlugins: ["remark-gfm", "remark-smartypants", "remark-math"],
    rehypePlugins: [
      //'rehype-slug', < needed only prior beta.22
      "rehype-mathjax",
    ],
  },
});

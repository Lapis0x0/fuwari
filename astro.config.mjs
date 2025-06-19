import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import swup from "@swup/astro";
import Compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import fs from 'fs';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  site: "https://www.lapis.cafe/",
  base: "/",
  trailingSlash: "always",
  integrations: [
    sitemap(),
    tailwind({
      nesting: true,
    }),
    swup({
      theme: false,
      animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
      // the default value `transition-` cause transition delay
      // when the Tailwind class `transition-all` is used
      containers: ["main", "#toc"],
      smoothScrolling: true,
      cache: true,
      preload: true,
      accessibility: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
    }),
    icon({
      include: {
        mdi: ["*"],
        tabler: ["*"],
        "fa6-brands": ["*"],
        "fa6-regular": ["*"],
        "fa6-solid": ["*"],
      },
    }),
    svelte(),
    Compress({
      CSS: false,
      Image: false,
      Action: {
        Passed: async () => true, // https://github.com/PlayForm/Compress/issues/376
      },
    }),
    // Search Index Generator Integration
    {
      name: 'search-index-generator',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const astroContent = 'astro:content';
          const { getCollection } = await import(/* @vite-ignore */ astroContent);
          
          // Helper to sort posts by date
          const getSortedPosts = async () => {
            const posts = await getCollection('posts');
            return posts.sort(
              (a, b) =>
                new Date(b.data.published).valueOf() - new Date(a.data.published).valueOf()
            );
          };

          console.log('Generating search index...');
          const posts = await getSortedPosts();
          const searchIndex = [];

          for (const post of posts) {
            const plainText = toString(fromMarkdown(post.body));
            const summary = plainText.slice(0, 200);

            searchIndex.push({
              title: post.data.title,
              summary: summary,
              tags: post.data.tags,
              url: `/posts/${post.slug}/`,
              date: post.data.published,
              content: plainText,
            });
          }

          const outputPath = path.join(dir.pathname, 'pizza-search/search-index.json');
          // Ensure the output directory exists
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
          console.log('Search index generated successfully!');
        },
      },
    },
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkExcerpt,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      remarkSectionize,
      parseDirectiveNode,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            note: (x, y) => AdmonitionComponent(x, y, "note"),
            tip: (x, y) => AdmonitionComponent(x, y, "tip"),
            important: (x, y) => AdmonitionComponent(x, y, "important"),
            caution: (x, y) => AdmonitionComponent(x, y, "caution"),
            warning: (x, y) => AdmonitionComponent(x, y, "warning"),
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // temporarily suppress this warning
          if (
            warning.message.includes("is dynamically imported by") &&
            warning.message.includes("but also statically imported by")
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});

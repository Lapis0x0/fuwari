import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import fs from 'fs';
import path from 'path';

export default function searchIndexGenerator() {
  return {
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
  };
}
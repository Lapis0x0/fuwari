import { getCollection } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSearchIndex() {
  console.log('Generating search index with astro exec...');
  const posts = await getCollection('posts');
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.published).valueOf() - new Date(a.data.published).valueOf()
  );
  const searchIndex = [];

  for (const post of sortedPosts) {
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

  const outputPath = path.resolve(__dirname, '../public/pizza-search/search-index.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));
  console.log('Search index generated successfully!');
}

generateSearchIndex();
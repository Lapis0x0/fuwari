import { glob } from 'glob';
import matter from 'gray-matter';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_PATH = path.resolve(__dirname, '../src/content/posts');
const OUTPUT_PATH = path.resolve(__dirname, '../public/pizza-search/search-index.json');

async function generateSearchIndex() {
  console.log('Generating search index from filesystem...');
  
  const files = await glob(`${POSTS_PATH}/**/*.md`);
  const searchIndex = [];

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(fileContent);

    // Skip drafts or posts without a title/date
    if (data.draft || !data.title || !data.published) {
      continue;
    }

    const plainText = toString(fromMarkdown(content));
    const summary = plainText.slice(0, 200);
    
    // Generate slug from file path
    const slug = path.relative(POSTS_PATH, file).replace(/\.md$/, '');

    searchIndex.push({
      title: data.title,
      summary: summary,
      tags: data.tags || [],
      url: `/posts/${slug}/`,
      date: data.published,
      content: plainText,
    });
  }

  // Sort by date descending
  searchIndex.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(searchIndex, null, 2));
  
  console.log(`Search index generated successfully with ${searchIndex.length} entries!`);
}

generateSearchIndex();
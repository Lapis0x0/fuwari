import { getCollection } from 'astro:content';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';

export async function GET() {
  const posts = await getCollection('posts', (post) => !post.data.draft);

  const searchIndex = posts.map(post => {
    const plainText = toString(fromMarkdown(post.body));
    const summary = plainText.slice(0, 200);

    return {
      title: post.data.title,
      summary: summary,
      tags: post.data.tags || [],
      url: `/posts/${post.slug}/`,
      date: post.data.published,
      content: plainText,
    };
  });

  // Sort by date descending
  searchIndex.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  return new Response(JSON.stringify(searchIndex, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
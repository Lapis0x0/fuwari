import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts');
const OUTPUT_PATH = path.resolve(__dirname, '../public/pizza-search/search-index.json');

function walkDir(dir: string, filelist: string[] = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkDir(filepath, filelist);
    } else if (file.endsWith('.md')) {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function extractSummary(content: string) {
  // 简单提取摘要：取前200字
  return content.replace(/[#>*\-\[\]!`_>]/g, '').slice(0, 200);
}

function getPostUrl(filepath: string) {
  // 只做小写和去除 .md 后缀，保留目录名原样，末尾补 /
  const rel = path.relative(POSTS_DIR, filepath).replace(/\\/g, '/').replace(/\.md$/, '').toLowerCase();
  return `/posts/${rel}/`;
}

function main() {
  const files = walkDir(POSTS_DIR);
  const index = files.map(fp => {
    const raw = fs.readFileSync(fp, 'utf-8');
    const { data, content } = matter(raw);
    return {
      title: data.title || path.basename(fp, '.md'),
      summary: data.summary || extractSummary(content),
      tags: data.tags || [],
      url: getPostUrl(fp),
      date: data.date || '',
      content: extractSummary(content + ''), // 可选：只索引前部分正文
    };
  });
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`INFINI Pizza 索引已生成，共${index.length}篇文章。`);
}

main();

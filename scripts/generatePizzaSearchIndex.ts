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

// 模拟 Astro 对目录名的处理
function processAstroDirectory(dirname: string): string {
  // 1. 小写化
  let result = dirname.toLowerCase();
  
  // 2. 特殊处理空格和特殊字符
  // 将空格和 & 替换为双横线
  result = result.replace(/[\s&]+/g, '--');
  
  // 3. 移除其他特殊字符
  result = result.replace(/[^a-z0-9\-\u4e00-\u9fa5]/g, '');
  
  // 4. 合并连续的横线
  result = result.replace(/--+/g, '--');
  
  return result;
}

// 模拟 Astro 对文件名的处理
function processAstroFilename(filename: string): string {
  // 1. 英文字母小写化
  let result = filename.replace(/[a-zA-Z]+/g, match => match.toLowerCase());
  
  // 2. 将空格移除（Astro 对文件名中的空格的处理）
  result = result.replace(/\s+/g, '');
  
  // 3. 移除中文标点符号（如：、，；：等）
  result = result.replace(/[：，、；！？]/g, '');
  
  return result;
}

// 获取文章的真实 URL
function getPostUrl(filepath: string): string {
  // 标准化文件路径
  const normalizedPath = filepath.replace(/\\/g, '/');
  
  // 获取相对路径并移除 .md 后缀
  const rel = path.relative(POSTS_DIR, normalizedPath).replace(/\.md$/, '');
  
  // 分割路径
  const parts = rel.split('/');
  
  // 处理目录名（特殊处理空格和 & 符号）
  for (let i = 0; i < parts.length - 1; i++) {
    parts[i] = processAstroDirectory(parts[i]);
  }
  
  // 处理文件名（小写英文，移除中文标点）
  if (parts.length > 0) {
    parts[parts.length - 1] = processAstroFilename(parts[parts.length - 1]);
  }
  
  // 重新组合路径
  const processedPath = parts.join('/');
  
  // 构建 URL，确保以斜杠结尾
  let url = `/posts/${processedPath}/`;
  
  return url;
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

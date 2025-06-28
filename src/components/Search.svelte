<script lang="ts">
import { onMount, onDestroy } from 'svelte'

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindResultData>;
  excerpt: string;
}

interface PagefindResultData {
  url: string;
  meta: {
    title: string;
    image: string;
  };
  excerpt: string;
}

interface SearchResult {
  title: string;
  summary: string;
  url: string;
}

let keyword = '';
let results: SearchResult[] = [];
let loading = false;
let error = '';
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let pagefind: any = null;

onMount(() => {
  const loadPagefind = async () => {
    try {
      // @ts-ignore
      if (window.pagefind) {
        // @ts-ignore
        pagefind = window.pagefind;
        await pagefind.options({ excerptLength: 150 });
        return;
      }

      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/pagefind/pagefind.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      // @ts-ignore
      pagefind = window.pagefind;
      await pagefind.options({ excerptLength: 150 });
    } catch (e) {
      error = '搜索服务加载失败';
      console.error('Failed to load Pagefind:', e);
    }
  };

  loadPagefind();

  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
  
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
    if (searchTimeout) clearTimeout(searchTimeout);
  };
});

async function searchPizza() {
  if (!keyword.trim()) {
    results = [];
    return;
  }
  if (!pagefind) {
    loading = true; // 如果 pagefind 仍在加载中，显示加载状态
    return;
  }
  loading = true;
  error = '';

  try {
    const search = await pagefind.search(keyword);
    const searchResults = await Promise.all(search.results.map(async (result: PagefindResult) => {
      const data = await result.data();
      return {
        title: data.meta.title,
        summary: result.excerpt || data.excerpt || '',
        url: data.url,
      };
    }));
    results = searchResults.slice(0, 20);
  } catch (e) {
    error = '搜索失败';
    console.error('Search failed:', e);
  } finally {
    loading = false;
  }
}

const debouncedSearch = debounce(searchPizza, 300);
$: keyword && debouncedSearch();

function debounce(fn: Function, delay: number) {
  return function(...args: any[]) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}

function handleClickOutside(e: MouseEvent | TouchEvent) {
  const searchWrapper = document.querySelector('.search-bar-wrapper');
  if (searchWrapper && !searchWrapper.contains(e.target as Node)) {
    keyword = '';
    results = [];
  }
}
</script>

<!-- 搜索框和结果展示的 HTML 结构保持不变 -->
<div class="search-bar-wrapper relative">
  <div class="flex items-center h-11 bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10 rounded-lg px-2 relative">
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" class="text-[1.25rem] iconify iconify--material-symbols text-black/30 dark:text-white/30 ml-2" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path></svg>
    <input
      class="transition-all pl-4 text-sm bg-transparent outline-0 h-full w-full text-black/70 dark:text-white/80"
      placeholder="输入关键词搜索..."
      bind:value={keyword}
      autocomplete="off"
      aria-label="站内搜索"
    />
  </div>
  {#if keyword}
    <div class="search-result-pop absolute mt-2 z-50 bg-white dark:bg-[#1e2127] rounded-xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-800/50 overflow-auto max-h-[85vh]">
      {#if loading}
        <div class="py-4 text-center text-sm text-gray-400 dark:text-gray-500">搜索中...</div>
      {/if}
      {#if error}
        <div class="py-4 text-center text-sm text-red-500 dark:text-red-400">{error}</div>
      {/if}
      {#if !loading && results.length === 0 && keyword}
        <div class="py-4 text-center text-sm text-gray-400 dark:text-gray-500">未找到相关内容</div>
      {/if}
      {#each results as item}
        <a href={item.url} rel="noopener noreferrer" class="block rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800/80 transition duration-150">
          <div class="font-bold text-base text-gray-900 dark:text-gray-50 flex items-center">
            {item.title}
            <svg class="ml-2 text-[0.9rem] text-[var(--primary)] dark:text-[var(--primary-dark,var(--primary))]" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m16.59 8.59-4.58 4.58L7.41 8.59 6 10l6 6 6-6z"/></svg>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 mt-1">{@html item.summary}</div>
        </a>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search-bar-wrapper {
    width: 100%;
    max-width: 400px;
    min-width: 180px;
    margin-left: auto;
    margin-right: 0;
    position: relative;
  }
  .search-result-pop {
    --search-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
    --search-border: 1px solid var(--border-color, #eee);
    --search-bg: var(--bg-color, #fff);
    
    box-shadow: var(--search-shadow);
    border-radius: 1rem;
    border: var(--search-border);
    z-index: 100;
    margin-top: 0.5rem;
    width: 500px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  :global(.dark) .search-result-pop {
    --search-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 1.5px 6px rgba(0,0,0,0.15);
    --search-border: 1px solid rgba(75, 85, 99, 0.3);
    --border-color: rgba(75, 85, 99, 0.3);
    --bg-color: #1e2127;
  }
  @media (max-width: 600px) {
    .search-bar-wrapper {
      max-width: 100vw;
      min-width: 0;
      margin: 0 8px;
    }
    .search-result-pop {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      transform: none;
      width: calc(100% - 16px);
      max-height: 70vh;
      margin: 8px auto 0;
      border-radius: 0.75rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    
    .search-result-pop a {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(229, 231, 235, 0.1);
    }
    
    .search-result-pop a:last-child {
      border-bottom: none;
    }
  }
  input:focus {
    outline: 0;
  }
</style>

<script lang="ts">
import { onMount } from 'svelte'
import { url } from '@utils/url-utils.ts'
import { i18n } from '@i18n/translation'
import I18nKey from '@i18n/i18nKey'
import Icon from '@iconify/svelte'
let keywordDesktop = ''
let keywordMobile = ''
let result = []
const fakeResult = [
  {
    url: url('/'),
    meta: {
      title: 'This Is a Fake Search Result',
    },
    excerpt:
      'Because the search cannot work in the <mark>dev</mark> environment.',
  },
  {
    url: url('/'),
    meta: {
      title: 'If You Want to Test the Search',
    },
    excerpt: 'Try running <mark>npm build && npm preview</mark> instead.',
  },
]

let search = (keyword: string, isDesktop: boolean) => {}

onMount(() => {
  // 外部点击/触摸隐藏弹窗
  function handleClickOutside(e: MouseEvent | TouchEvent) {
    const searchWrapper = document.querySelector('.search-bar-wrapper');
    if (searchWrapper && !searchWrapper.contains(e.target as Node)) {
      keyword = '';
    }
  }
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
  // 清理监听
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  };

  search = async (keyword: string, isDesktop: boolean) => {
    let panel = document.getElementById('search-panel')
    if (!panel) return

    if (!keyword && isDesktop) {
      panel.classList.add('float-panel-closed')
      return
    }

    let arr = []
    if (import.meta.env.PROD) {
      const ret = await pagefind.search(keyword)
      for (const item of ret.results) {
        arr.push(await item.data())
      }
    } else {
      // Mock data for non-production environment
      arr = fakeResult
    }

    if (!arr.length && isDesktop) {
      panel.classList.add('float-panel-closed')
      return
    }

    if (isDesktop) {
      panel.classList.remove('float-panel-closed')
    }
    result = arr
  }
})

const togglePanel = () => {
  let panel = document.getElementById('search-panel')
  panel?.classList.toggle('float-panel-closed')
}

$: search(keywordDesktop, true)
$: search(keywordMobile, false)

let keyword = '';
let results = [];
let loading = false;
let error = '';
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// 防抖函数，避免频繁搜索导致的闪烁
function debounce(fn: Function, delay: number = 300) {
  return function(...args: any[]) {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      fn(...args);
    }, delay);
  }
}

async function searchPizza() {
  if (!keyword) {
    results = [];
    return;
  }
  loading = true;
  error = '';
  try {
    const res = await fetch('/pizza-search/search-index.json');
    const data = await res.json();
    const kw = keyword.trim().toLowerCase();
    results = data.filter(item =>
      item.title?.toLowerCase().includes(kw) ||
      item.summary?.toLowerCase().includes(kw) ||
      (item.tags && item.tags.join(',').toLowerCase().includes(kw))
    ).slice(0, 20);
  } catch (e) {
    error = '搜索索引加载失败';
  } finally {
    loading = false;
  }
}

// 使用防抖处理搜索，减少闪烁
const debouncedSearch = debounce(searchPizza, 300);
$: keyword && debouncedSearch();
</script>

<!-- 桌面端和移动端通用搜索框 -->
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
  {#if keyword && (loading || error || results.length > 0)}
    <div class="search-result-pop absolute left-0 mt-2 w-full z-50 bg-white dark:bg-[#1e2127] rounded-xl shadow-lg dark:shadow-2xl border border-gray-100 dark:border-gray-800/50 overflow-auto max-h-[85vh]">
      {#if loading}
        <div class="py-4 text-center text-sm text-gray-400 dark:text-gray-500">搜索中...</div>
      {/if}
      {#if error}
        <div class="py-4 text-center text-sm text-red-500 dark:text-red-400">{error}</div>
      {/if}
      {#if keyword && !loading && results.length === 0}
        <div class="py-4 text-center text-sm text-gray-400 dark:text-gray-500">未找到相关内容</div>
      {/if}
      {#each results as item}
        <a href={item.url} class="block rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-800/80 transition duration-150">
          <div class="font-bold text-base text-gray-900 dark:text-gray-50 flex items-center">
            {item.title}
            <svg class="ml-2 text-[0.9rem] text-[var(--primary)] dark:text-[var(--primary-dark,var(--primary))]" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m16.59 8.59-4.58 4.58L7.41 8.59 6 10l6 6 6-6z"/></svg>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{item.summary}</div>
          {#if item.tags?.length}
            <div class="mt-2 flex flex-wrap gap-1.5">
              {#each item.tags as tag}
                <span class="px-2 py-0.5 rounded-md bg-gray-100/80 dark:bg-gray-700/80 text-xs text-gray-600 dark:text-gray-100 border border-transparent dark:border-gray-600/30">{tag}</span>
              {/each}
            </div>
          {/if}
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
    /* 移除固定背景色和边框，改用CSS变量 */
    --search-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
    --search-border: 1px solid var(--border-color, #eee);
    --search-bg: var(--bg-color, #fff);
    
    box-shadow: var(--search-shadow);
    border-radius: 1rem;
    border: var(--search-border);
    /* 背景色由Tailwind类控制，此处移除 */
    z-index: 100;
    margin-top: 0.5rem;
    min-width: 220px;
  }
  
  /* 适配深色模式 */
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
      /* 恢复为absolute定位，确保显示在搜索框下方 */
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      width: calc(100% - 16px); /* 减去边距 */
      max-height: 70vh; /* 最大高度限制为屏幕高度70% */
      margin: 8px auto 0;
      border-radius: 0.75rem;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    
    /* 搜索结果内容样式优化 */
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

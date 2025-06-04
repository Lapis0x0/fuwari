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

$: keyword, searchPizza();
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
    <div class="search-result-pop absolute left-0 mt-2 w-full z-50 bg-white dark:bg-[#23272f] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-auto max-h-96">
      {#if loading}
        <div class="py-4 text-center text-sm text-gray-400">搜索中...</div>
      {/if}
      {#if error}
        <div class="py-4 text-center text-sm text-red-500">{error}</div>
      {/if}
      {#if keyword && !loading && results.length === 0}
        <div class="py-4 text-center text-sm text-gray-400">未找到相关内容</div>
      {/if}
      {#each results as item}
        <a href={item.url} class="block rounded-xl px-3 py-2 mb-1 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition">
          <div class="font-bold text-base text-gray-900 dark:text-white flex items-center">
            {item.title}
            <svg class="ml-2 text-[0.9rem] text-[var(--primary)]" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m16.59 8.59-4.58 4.58L7.41 8.59 6 10l6 6 6-6z"/></svg>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{item.summary}</div>
          {#if item.tags?.length}
            <div class="mt-1 flex flex-wrap gap-2">
              {#each item.tags as tag}
                <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-200">{tag}</span>
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
    box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
    border-radius: 1rem;
    border: 1px solid #eee;
    background: #fff;
    z-index: 100;
    margin-top: 0.5rem;
    min-width: 220px;
  }
  @media (max-width: 600px) {
    .search-bar-wrapper {
      max-width: 100vw;
      min-width: 0;
      margin: 0 8px;
    }
    .search-result-pop {
      left: 0;
      right: 0;
      min-width: 0;
      width: 100vw;
      border-radius: 0.75rem;
    }
  }
  input:focus {
    outline: 0;
  }
</style>

<template>
  <div class="search-view">
    <header class="header">
      <div class="container">
        <h1 class="logo">诗词搜索</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/search" class="nav-link">搜索</router-link>
          <router-link to="/favorites" class="nav-link">收藏</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入诗词名、作者或名句"
            size="large"
            @keyup.enter="performSearch"
            @input="handleInput"
          >
            <template #append>
              <el-button @click="performSearch" :icon="Search" />
            </template>
          </el-input>
        </div>

        <!-- 搜索结果 -->
        <div v-if="searchResults.length > 0" class="search-results">
          <h3 class="results-title">搜索结果 ({{ searchResults.length }})</h3>
          <div class="results-list">
            <div 
              v-for="poem in searchResults" 
              :key="poem.id"
              class="result-item"
              @click="viewPoemDetail(poem.id)"
            >
              <h4 class="poem-title">{{ poem.title }}</h4>
              <p class="poem-author">{{ poem.author }}</p>
              <p class="poem-content">{{ poem.content }}</p>
            </div>
          </div>
        </div>

        <!-- 搜索提示 -->
        <div v-else-if="searchKeyword && !isSearching" class="no-results">
          <p>未找到相关诗词，请尝试其他关键词</p>
        </div>

        <!-- 热门搜索 -->
        <div v-if="!searchKeyword" class="hot-searches">
          <h3 class="section-title">热门搜索</h3>
          <div class="hot-tags">
            <el-tag 
              v-for="tag in hotTags" 
              :key="tag"
              class="hot-tag"
              @click="setSearchKeyword(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const searchKeyword = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const hotTags = ref(['李白', '杜甫', '唐诗三百首', '宋词', '静夜思', '春晓'])

// 模拟搜索函数
const mockSearch = (keyword: string) => {
  const mockData = [
    {
      id: 1,
      title: '静夜思',
      author: '李白',
      content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
    },
    {
      id: 2,
      title: '春晓',
      author: '孟浩然',
      content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
    },
    {
      id: 3,
      title: '登鹳雀楼',
      author: '王之涣',
      content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
    }
  ]

  return mockData.filter(poem => 
    poem.title.includes(keyword) || 
    poem.author.includes(keyword) ||
    poem.content.includes(keyword)
  )
}

// 简单的防抖函数实现
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const performSearch = debounce(() => {
  if (!searchKeyword.value.trim()) {
    searchResults.value = []
    return
  }

  isSearching.value = true
  setTimeout(() => {
    searchResults.value = mockSearch(searchKeyword.value)
    isSearching.value = false
  }, 300)
}, 300)

const handleInput = () => {
  if (searchKeyword.value) {
    performSearch()
  } else {
    searchResults.value = []
  }
}

const viewPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}

const setSearchKeyword = (keyword: string) => {
  searchKeyword.value = keyword
  performSearch()
}

onMounted(() => {
  if (route.query.q) {
    searchKeyword.value = route.query.q as string
    performSearch()
  }
})
</script>

<style lang="scss" scoped>
.search-view {
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    color: var(--primary-color);
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav {
    display: flex;
    gap: 2rem;

    .nav-link {
      color: var(--text-color);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover, &.router-link-active {
        color: var(--primary-color);
        background: rgba(139, 69, 19, 0.1);
      }
    }
  }
}

.main-content {
  padding: 2rem 0;

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 2rem;
  }
}

.search-box {
  margin-bottom: 2rem;
}

.search-results {
  .results-title {
    font-size: 1.2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  .results-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .result-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .poem-title {
      color: var(--primary-color);
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .poem-author {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .poem-content {
      color: var(--text-color);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-light);
}

.hot-searches {
  margin-top: 3rem;

  .section-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  .hot-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .hot-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .header .container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .main-content .container {
    padding: 0 1rem;
  }

  .hot-tags {
    justify-content: flex-start;
  }
}
</style>
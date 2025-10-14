<template>
  <div class="home-view">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <h1 class="logo">诗词赏析</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/search" class="nav-link">搜索</router-link>
          <router-link to="/favorites" class="nav-link">收藏</router-link>
        </nav>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <!-- 搜索区域 -->
        <section class="search-section">
          <h2 class="section-title">探索古典诗词之美</h2>
          <p class="section-subtitle">输入诗词名、作者或诗句片段，开启您的诗词之旅</p>
          
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="请输入诗词名、作者或名句"
              size="large"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch" :icon="Search" />
              </template>
            </el-input>
          </div>
        </section>

        <!-- 推荐诗词区域 -->
        <section class="recommend-section">
          <h3 class="section-title">热门推荐</h3>
          <div class="poem-grid">
            <div 
              v-for="poem in recommendedPoems" 
              :key="poem.id"
              class="poem-card"
              @click="viewPoemDetail(poem.id)"
            >
              <h4 class="poem-title">{{ poem.title }}</h4>
              <p class="poem-author">{{ poem.author }}</p>
              <p class="poem-excerpt">{{ poem.excerpt }}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')

// 模拟推荐诗词数据
const recommendedPoems = ref([
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    excerpt: '床前明月光，疑是地上霜。'
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    excerpt: '春眠不觉晓，处处闻啼鸟。'
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    excerpt: '白日依山尽，黄河入海流。'
  },
  {
    id: 4,
    title: '相思',
    author: '王维',
    excerpt: '红豆生南国，春来发几枝。'
  }
])

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
  }
}

const viewPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}
</script>

<style lang="scss" scoped>
.home-view {
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
}

.search-section {
  text-align: center;
  padding: 4rem 0;

  .section-title {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 2rem;
  }

  .search-box {
    max-width: 600px;
    margin: 0 auto;
  }
}

.recommend-section {
  margin-top: 4rem;

  .section-title {
    font-size: 1.8rem;
    color: var(--primary-color);
    margin-bottom: 2rem;
    text-align: center;
  }

  .poem-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .poem-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .poem-title {
      font-size: 1.2rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .poem-author {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .poem-excerpt {
      color: var(--text-color);
      line-height: 1.6;
    }
  }
}

@media (max-width: 768px) {
  .header .container {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .search-section {
    padding: 2rem 0;

    .section-title {
      font-size: 2rem;
    }
  }

  .poem-grid {
    grid-template-columns: 1fr;
  }
}
</style>
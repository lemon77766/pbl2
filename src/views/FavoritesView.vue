<template>
  <div class="favorites-view">
    <header class="header">
      <div class="container">
        <h1 class="logo">我的收藏</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/search" class="nav-link">搜索</router-link>
          <router-link to="/favorites" class="nav-link">收藏</router-link>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <div v-if="favorites.length > 0" class="favorites-list">
          <h2 class="section-title">收藏的诗词 ({{ favorites.length }})</h2>
          <div class="poem-grid">
            <div 
              v-for="poem in favorites" 
              :key="poem.id"
              class="favorite-item"
            >
              <div class="poem-content">
                <h3 class="poem-title" @click="viewPoemDetail(poem.id)">{{ poem.title }}</h3>
                <p class="poem-author">{{ poem.author }}</p>
                <p class="poem-excerpt">{{ poem.excerpt }}</p>
              </div>
              <div class="poem-actions">
                <el-button 
                  type="danger" 
                  size="small" 
                  :icon="Delete" 
                  @click="removeFavorite(poem.id)"
                >
                  移除
                </el-button>
                <el-button 
                  type="primary" 
                  size="small" 
                  :icon="View" 
                  @click="viewPoemDetail(poem.id)"
                >
                  查看
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <el-empty description="暂无收藏的诗词">
            <el-button type="primary" @click="$router.push('/search')">
              去发现诗词
            </el-button>
          </el-empty>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Delete, View } from '@element-plus/icons-vue'

const router = useRouter()
const favorites = ref<any[]>([])

// 模拟收藏数据
const mockFavorites = [
  {
    id: 1,
    title: '静夜思',
    author: '李白',
    excerpt: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    addedAt: '2023-10-27'
  },
  {
    id: 2,
    title: '春晓',
    author: '孟浩然',
    excerpt: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    addedAt: '2023-10-26'
  },
  {
    id: 3,
    title: '登鹳雀楼',
    author: '王之涣',
    excerpt: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。',
    addedAt: '2023-10-25'
  }
]

const loadFavorites = () => {
  // 这里应该调用API获取用户收藏列表
  favorites.value = mockFavorites
}

const removeFavorite = (poemId: number) => {
  const index = favorites.value.findIndex(item => item.id === poemId)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    // 这里应该调用API移除收藏
  }
}

const viewPoemDetail = (poemId: number) => {
  router.push(`/poem/${poemId}`)
}

onMounted(() => {
  loadFavorites()
})
</script>

<style lang="scss" scoped>
.favorites-view {
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
    max-width: 900px;
    margin: 0 auto;
    padding: 0 2rem;
  }
}

.section-title {
  font-size: 1.8rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.favorites-list {
  .poem-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .favorite-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .poem-content {
      flex: 1;

      .poem-title {
        color: var(--primary-color);
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: var(--secondary-color);
        }
      }

      .poem-author {
        color: var(--text-light);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .poem-excerpt {
        color: var(--text-color);
        line-height: 1.6;
      }
    }

    .poem-actions {
      display: flex;
      gap: 0.5rem;
      margin-left: 1rem;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
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

  .favorite-item {
    flex-direction: column;
    align-items: flex-start !important;

    .poem-actions {
      margin-left: 0;
      margin-top: 1rem;
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
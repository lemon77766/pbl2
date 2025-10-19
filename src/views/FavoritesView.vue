<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getPoemsByIds } from '@/api/poemApi'
import type { Poem } from '@/api/poemApi'


const userStore = useUserStore()
const favoritePoems = ref<Poem[]>([])
const loading = ref(false)

// 加载收藏的诗词
const loadFavoritePoems = async () => {
  loading.value = true
  try {
    const favoriteIds = userStore.getFavorites()
    if (favoriteIds.length > 0) {
      favoritePoems.value = await getPoemsByIds(favoriteIds)
    } else {
      favoritePoems.value = []
    }
  } catch (error) {
    console.error('加载收藏诗词失败:', error)
    favoritePoems.value = []
  } finally {
    loading.value = false
  }
}

// 移除收藏
const removeFromFavorites = (poemId: string) => {
  userStore.removeFavorite(poemId)
  // 从列表中移除
  favoritePoems.value = favoritePoems.value.filter(poem => poem.id !== poemId)
}

// 清空收藏
const clearAllFavorites = () => {
  userStore.clearFavorites()
  favoritePoems.value = []
}

onMounted(() => {
  loadFavoritePoems()
})
</script>

<template>
  <div class="favorites-container">

    
    <!-- 页面标题区域 -->
    <header class="page-header">
      <div class="container">
        <h1>我的收藏</h1>
        <p>珍藏你喜爱的诗词，随时回味经典之美</p>
      </div>
    </header>

    <div class="favorites-header">
      <div class="favorites-info">
        <span>共收藏 {{ userStore.getFavoriteCount() }} 首诗词</span>
        <el-button 
          v-if="favoritePoems.length > 0" 
          type="danger" 
          size="small" 
          @click="clearAllFavorites"
        >
          清空收藏
        </el-button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="favoritePoems.length === 0" class="empty-state">
      <el-empty description="暂无收藏的诗词">
        <el-button type="primary" @click="$router.push('/')">去发现诗词</el-button>
      </el-empty>
    </div>

    <div v-else class="favorites-list">
      <div 
        v-for="poem in favoritePoems" 
        :key="poem.id" 
        class="favorite-item"
      >
        <div class="poem-content">
          <h3 class="poem-title">{{ poem.title }}</h3>
          <p class="poem-author">作者：{{ poem.authors?.name ?? '佚名' }}</p>
          <p class="poem-text">{{ poem.content.replace(/\\n/g, '\n') }}</p>
        </div>
        <div class="poem-actions">
          <el-button 
            type="primary" 
            size="small"
            @click="$router.push(`/poem/${poem.id}`)"
          >
            查看详情
          </el-button>
          <el-button 
            type="danger" 
            size="small"
            @click="removeFromFavorites(poem.id)"
          >
            取消收藏
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: var(--text-color);
}

/* 页面标题区域样式 */
.page-header {
  background: #FBF5E6;
  border-bottom: 1px solid #E8DEC5;
  .container {
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 28px 20px;
  }
  h1 { 
    margin: 0 0 6px; 
    color: var(--primary-color); 
    letter-spacing: 4px; 
  }
  p  { 
    margin: 0; 
    color: var(--text-light); 
  }
}

.favorites-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 20px 0 30px;
  border-bottom: 1px solid #E8DEC5;
  padding-bottom: 20px;
}

.favorites-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.favorites-info span {
  color: var(--text-light);
  font-size: 14px;
}

.loading-container {
  padding: 40px 0;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid #E8DEC5;
  border-radius: 14px;
  background: #FBF5E6;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.favorite-item:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
}

.poem-content {
  flex: 1;
}

.poem-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
}

.poem-author {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 12px 0;
}

.poem-text {
  color: var(--text-color);
  line-height: 1.6;
  white-space: pre-line;
  margin: 0;
  max-height: 80px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.poem-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 20px;
}

/* 统一按钮样式为土金主题 */
:deep(.el-button--primary) {
  --el-color-primary: var(--primary-color);
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

:deep(.el-button--primary:hover),
:deep(.el-button--primary:focus) {
  background-color: #a05a2a;
  border-color: #a05a2a;
}

:deep(.el-button--danger) {
  --el-color-danger: #dc3545;
}

@media (max-width: 768px) {
  .favorites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .favorite-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .poem-actions {
    flex-direction: row;
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
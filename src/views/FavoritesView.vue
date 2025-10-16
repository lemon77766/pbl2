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
    <div class="favorites-header">
      <h1>我的收藏</h1>
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
          <p class="poem-author">作者：{{ poem.author_name }}</p>
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

<style scoped>
.favorites-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 20px;
}

.favorites-header h1 {
  color: #303133;
  margin: 0;
}

.favorites-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.favorites-info span {
  color: #606266;
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
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.poem-content {
  flex: 1;
}

.poem-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.poem-author {
  font-size: 14px;
  color: #909399;
  margin: 0 0 12px 0;
}

.poem-text {
  color: #606266;
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
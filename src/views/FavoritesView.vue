<template>
  <div class="favorites">
    <SiteHeader />
    <header class="page-header">
      <div class="container">
        <h1>我的收藏</h1>
        <p>在这里查看你标记喜欢的诗词与句子。</p>
      </div>
    </header>
    <main class="container">
      <div v-if="isLoading" class="loading-container">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="favorites.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>暂无收藏</h3>
        <p>你还没有收藏任何诗词，快去发现你喜欢的诗词吧！</p>
        <el-button type="primary" @click="goToHome">浏览诗词</el-button>
      </div>
      
      <div v-else class="favorites-grid">
        <div class="filters">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索收藏的诗词..."
            clearable
            @input="filterFavorites"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select
            v-model="selectedDynasty"
            placeholder="按朝代筛选"
            clearable
            @change="filterFavorites"
            class="dynasty-filter"
          >
            <el-option
              v-for="dynasty in dynasties"
              :key="dynasty"
              :label="dynasty"
              :value="dynasty"
            />
          </el-select>
        </div>
        
        <div class="favorites-list">
          <div
            v-for="favorite in filteredFavorites"
            :key="favorite.id"
            class="favorite-card"
          >
            <div class="card-content">
              <h3 class="poem-title">{{ favorite.poems?.title }}</h3>
              <p class="poem-author">{{ favorite.poems?.poem_authors?.name }} · {{ favorite.poems?.dynasty }}</p>
              <p class="poem-excerpt">{{ favorite.poems?.content?.split('\n')[0] }}...</p>
              <div class="card-actions">
                <span class="added-date">收藏于 {{ formatDate(favorite.created_at) }}</span>
                <div class="action-buttons">
                  <el-button
                    type="primary"
                    link
                    @click="viewPoemDetail(favorite.poems?.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    type="danger"
                    link
                    @click="removeFavorite(favorite.id)"
                  >
                    取消收藏
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredFavorites.length === 0 && favorites.length > 0" class="no-results">
          <p>没有找到匹配的收藏</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import SiteHeader from '@/components/SiteHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { usePoemStore } from '@/stores/poem'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const poemStore = usePoemStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const searchKeyword = ref('')
const selectedDynasty = ref('')
const favorites = ref<any[]>([])

// 计算属性
const dynasties = computed(() => {
  const dynastiesSet = new Set<string>()
  favorites.value.forEach(fav => {
    if (fav.poems?.dynasty) {
      dynastiesSet.add(fav.poems.dynasty)
    }
  })
  return Array.from(dynastiesSet)
})

const filteredFavorites = computed(() => {
  return favorites.value.filter(favorite => {
    const matchesKeyword = !searchKeyword.value || 
      favorite.poems?.title?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      favorite.poems?.content?.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      favorite.poems?.poem_authors?.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    const matchesDynasty = !selectedDynasty.value || 
      favorite.poems?.dynasty === selectedDynasty.value
    
    return matchesKeyword && matchesDynasty
  })
})

// 生命周期
onMounted(async () => {
  await loadFavorites()
})

// 方法
const loadFavorites = async () => {
  if (!authStore.user) {
    ElMessage.warning('请先登录后再查看收藏')
    return
  }

  isLoading.value = true
  try {
    await poemStore.fetchUserFavorites(authStore.user.id)
    favorites.value = poemStore.userFavorites
  } catch (error) {
    console.error('加载收藏失败:', error)
    ElMessage.error('加载收藏失败')
  } finally {
    isLoading.value = false
  }
}

const filterFavorites = () => {
  // 过滤逻辑已在计算属性中处理
}

const viewPoemDetail = (poemId: string) => {
  if (poemId) {
    router.push(`/poem/${poemId}`)
  }
}

const removeFavorite = async (favoriteId: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消收藏吗？',
      '取消收藏',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    if (authStore.user) {
      await poemStore.removeFavorite(favoriteId, authStore.user.id)
      await loadFavorites() // 重新加载收藏列表
      ElMessage.success('已取消收藏')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消收藏失败:', error)
      ElMessage.error('取消收藏失败')
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.page-header {
  background: #FBF5E6;
  border-bottom: 1px solid #E8DEC5;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 20px;
    
    h1 {
      margin: 0 0 6px;
      color: var(--primary-color);
      letter-spacing: 4px;
    }
    
    p {
      margin: 0;
      color: var(--text-light);
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-light);
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  h3 {
    margin: 0 0 12px;
    color: var(--text-color);
  }
  
  p {
    margin: 0 0 24px;
    line-height: 1.6;
  }
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  
  .search-input {
    flex: 1;
    max-width: 400px;
  }
  
  .dynasty-filter {
    width: 200px;
  }
}

.favorites-list {
  display: grid;
  gap: 16px;
}

.favorite-card {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-content {
    .poem-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .poem-author {
      margin: 0 0 12px;
      color: var(--text-light);
      font-size: 14px;
    }
    
    .poem-excerpt {
      margin: 0 0 16px;
      color: var(--text-color);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .added-date {
        color: var(--text-light);
        font-size: 12px;
      }
      
      .action-buttons {
        display: flex;
        gap: 12px;
      }
    }
  }
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    
    .search-input {
      max-width: none;
    }
    
    .dynasty-filter {
      width: 100%;
    }
  }
  
  .favorite-card {
    .card-actions {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
      
      .action-buttons {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
}
</style>
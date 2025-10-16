<template>
  <div class="search">
    <SiteHeader />
    <header class="page-header">
      <div class="container">
        <h1>诗词搜索</h1>
        <p>搜索你感兴趣的诗词、作者或关键词</p>
      </div>
    </header>
    <main class="container">
      <!-- 搜索框 -->
      <div class="search-section">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="输入诗词标题、作者、内容或关键词..."
            size="large"
            @keyup.enter="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button 
            type="primary" 
            size="large" 
            @click="handleSearch"
            :loading="isLoading"
          >
            搜索
          </el-button>
        </div>
        
        <!-- 高级搜索选项 -->
        <div class="advanced-options" v-if="showAdvanced">
          <div class="filter-row">
            <el-select
              v-model="searchFilters.dynasty"
              placeholder="选择朝代"
              clearable
              class="filter-select"
            >
              <el-option
                v-for="dynasty in dynastyOptions"
                :key="dynasty.value"
                :label="dynasty.label"
                :value="dynasty.value"
              />
            </el-select>
            
            <el-select
              v-model="searchFilters.author"
              placeholder="选择作者"
              clearable
              filterable
              class="filter-select"
            >
              <el-option
                v-for="author in authorOptions"
                :key="author.value"
                :label="author.label"
                :value="author.value"
              />
            </el-select>
            
            <el-button
              type="text"
              @click="toggleAdvanced"
              class="toggle-advanced"
            >
              简化搜索
            </el-button>
          </div>
        </div>
        
        <el-button
          type="text"
          @click="toggleAdvanced"
          class="toggle-advanced-btn"
          v-if="!showAdvanced"
        >
          高级搜索
        </el-button>
      </div>

      <!-- 搜索结果 -->
      <div class="results-section">
        <div v-if="isLoading" class="loading-container">
          <LoadingSpinner />
          <p>正在搜索中...</p>
        </div>
        
        <div v-else-if="searchResults.length === 0 && hasSearched" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>未找到相关诗词</h3>
          <p>尝试使用不同的关键词或调整搜索条件</p>
        </div>
        
        <div v-else-if="searchResults.length > 0" class="results-container">
          <div class="results-header">
            <h3>搜索结果 ({{ searchResults.length }} 首)</h3>
            <div class="sort-options">
              <el-radio-group v-model="sortBy" size="small">
                <el-radio-button label="relevance">相关度</el-radio-button>
                <el-radio-button label="title">标题</el-radio-button>
                <el-radio-button label="dynasty">朝代</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          
          <div class="results-grid">
            <div
              v-for="poem in sortedResults"
              :key="poem.id"
              class="poem-card"
              @click="viewPoemDetail(poem.id)"
            >
              <div class="card-header">
                <h4 class="poem-title">{{ poem.title }}</h4>
                <el-tag 
                  :type="getDynastyTagType(poem.dynasty)"
                  size="small"
                >
                  {{ poem.dynasty }}
                </el-tag>
              </div>
              
              <p class="poem-author">{{ poem.author }}</p>
              
              <div class="poem-content">
                <p>{{ poem.content.split('\n')[0] }}...</p>
              </div>
              
              <div class="card-footer">
                <span class="match-type" v-if="poem.matchType">
                  {{ getMatchTypeText(poem.matchType) }}
                </span>
                <el-button
                  type="text"
                  size="small"
                  @click.stop="toggleFavorite(poem.id)"
                  class="favorite-btn"
                >
                  <el-icon :color="isFavorite(poem.id) ? '#ff6b6b' : '#ccc'">
                    <StarFilled />
                  </el-icon>
                  {{ isFavorite(poem.id) ? '已收藏' : '收藏' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 搜索提示 -->
        <div v-else class="search-tips">
          <div class="tips-section">
            <h4>搜索提示</h4>
            <div class="tip-examples">
              <div class="tip-item">
                <span class="tip-label">按标题搜索：</span>
                <span class="tip-example">"静夜思"</span>
              </div>
              <div class="tip-item">
                <span class="tip-label">按作者搜索：</span>
                <span class="tip-example">"李白"</span>
              </div>
              <div class="tip-item">
                <span class="tip-label">按关键词搜索：</span>
                <span class="tip-example">"明月"</span>
              </div>
              <div class="tip-item">
                <span class="tip-label">按诗句搜索：</span>
                <span class="tip-example">"床前明月光"</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, StarFilled } from '@element-plus/icons-vue'
import SiteHeader from '@/components/SiteHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { usePoemStore } from '@/stores/poem'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const poemStore = usePoemStore()
const authStore = useAuthStore()

// 响应式数据
const searchKeyword = ref('')
const isLoading = ref(false)
const hasSearched = ref(false)
const showAdvanced = ref(false)
const sortBy = ref('relevance')

const searchFilters = ref({
  dynasty: '',
  author: ''
})

const searchResults = ref<any[]>([])

// 计算属性
const dynastyOptions = computed(() => [
  { value: '唐代', label: '唐代' },
  { value: '宋代', label: '宋代' },
  { value: '元代', label: '元代' },
  { value: '明代', label: '明代' },
  { value: '清代', label: '清代' }
])

const authorOptions = computed(() => [
  { value: '李白', label: '李白' },
  { value: '杜甫', label: '杜甫' },
  { value: '王维', label: '王维' },
  { value: '苏轼', label: '苏轼' },
  { value: '李清照', label: '李清照' }
])

const sortedResults = computed(() => {
  const results = [...searchResults.value]
  
  switch (sortBy.value) {
    case 'title':
      return results.sort((a, b) => a.title.localeCompare(b.title))
    case 'dynasty':
      return results.sort((a, b) => a.dynasty.localeCompare(b.dynasty))
    case 'relevance':
    default:
      return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
  }
})

// 方法
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  isLoading.value = true
  hasSearched.value = true

  try {
    await poemStore.searchPoems(searchKeyword.value, {
      dynasty: searchFilters.value.dynasty,
      author: searchFilters.value.author,
      limit: 50
    })
    
    searchResults.value = poemStore.searchResults
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

const viewPoemDetail = (poemId: string) => {
  router.push(`/poem/${poemId}`)
}

const isFavorite = (poemId: string) => {
  if (!authStore.user) return false
  return poemStore.userFavorites.some(fav => fav.poem_id === poemId)
}

const toggleFavorite = async (poemId: string) => {
  if (!authStore.user) {
    ElMessage.warning('请先登录后再收藏')
    return
  }

  try {
    const result = await poemStore.toggleFavorite(authStore.user.id, poemId)
    if (result) {
      ElMessage.success('收藏成功')
    } else {
      ElMessage.success('已取消收藏')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const getDynastyTagType = (dynasty: string) => {
  const types: Record<string, any> = {
    '唐代': 'success',
    '宋代': 'warning',
    '元代': 'info',
    '明代': '',
    '清代': 'danger'
  }
  return types[dynasty] || ''
}

const getMatchTypeText = (matchType: string) => {
  const texts: Record<string, string> = {
    'title': '标题匹配',
    'author': '作者匹配',
    'content': '内容匹配'
  }
  return texts[matchType] || '相关匹配'
}

// 生命周期
onMounted(() => {
  // 如果有路由参数，自动搜索
  const route = router.currentRoute.value
  if (route.query.q) {
    searchKeyword.value = route.query.q as string
    handleSearch()
  }
})
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

.search-section {
  margin-bottom: 40px;
  
  .search-box {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    
    :deep(.el-input) {
      flex: 1;
    }
  }
  
  .advanced-options {
    margin-top: 16px;
    
    .filter-row {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .filter-select {
        width: 200px;
      }
    }
  }
  
  .toggle-advanced-btn {
    margin-top: 8px;
  }
}

.results-section {
  min-height: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  
  p {
    margin-top: 16px;
    color: var(--text-light);
  }
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
    margin: 0;
    line-height: 1.6;
  }
}

.results-container {
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h3 {
      margin: 0;
      color: var(--text-color);
    }
  }
  
  .results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
}

.poem-card {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    
    .poem-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
      line-height: 1.4;
    }
  }
  
  .poem-author {
    margin: 0 0 12px;
    color: var(--text-light);
    font-size: 14px;
  }
  
  .poem-content {
    margin-bottom: 16px;
    
    p {
      margin: 0;
      color: var(--text-color);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .match-type {
      color: var(--text-light);
      font-size: 12px;
    }
    
    .favorite-btn {
      padding: 4px 8px;
      
      &:hover {
        background: rgba(255, 107, 107, 0.1);
      }
    }
  }
}

.search-tips {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 24px;
  
  .tips-section {
    h4 {
      margin: 0 0 16px;
      color: var(--primary-color);
    }
    
    .tip-examples {
      display: grid;
      gap: 8px;
    }
    
    .tip-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .tip-label {
        color: var(--text-color);
        min-width: 100px;
      }
      
      .tip-example {
        background: rgba(255, 255, 255, 0.8);
        padding: 4px 8px;
        border-radius: 4px;
        color: var(--primary-color);
        font-family: monospace;
      }
    }
  }
}

@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr !important;
  }
  
  .search-box {
    flex-direction: column;
    
    :deep(.el-input) {
      width: 100%;
    }
  }
  
  .advanced-options .filter-row {
    flex-direction: column;
    align-items: stretch;
    
    .filter-select {
      width: 100% !important;
    }
  }
  
  .results-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}
</style>
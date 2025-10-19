<template>
  <div class="search">


    <div class="container">
      <!-- 搜索框 -->
      <div class="search-section">
        <div class="search-box">
          <el-input
            v-model="keyword"
            placeholder="搜索诗词、作者或关键词..."
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        
        <div class="search-tips">
          <span>热门搜索：</span>
          <el-tag
            v-for="tag in hotKeywords"
            :key="tag"
            type="info"
            class="hot-tag"
            @click="setKeyword(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div class="results-section" v-if="searched">
        <div class="results-header">
          <h2>搜索结果</h2>
          <span class="results-count">共找到 {{ results.length }} 条结果</span>
        </div>

        <div class="results-list" v-if="results.length > 0">
          <div
            v-for="poem in results"
            :key="poem.id"
            class="result-item"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="poem-info">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <div class="poem-meta">
                <span class="author">{{ poem.author }}</span>
                <span class="dynasty">{{ poem.dynasty }}</span>
              </div>
              <p class="poem-excerpt" style="white-space: pre-line;">{{ poem.content.replace(/\\n/g, '\n') }}</p>
            </div>
            <div class="poem-actions">
              <el-button 
                :icon="isFavorite(poem.id) ? StarFilled : Star" 
                :type="isFavorite(poem.id) ? 'warning' : 'default'"
                size="small"
                @click="toggleFavorite(poem.id, $event)"
                class="favorite-btn"
              >
                {{ isFavorite(poem.id) ? '已收藏' : '收藏' }}
              </el-button>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div v-else class="no-results">
          <el-empty description="没有找到相关诗词" />
        </div>
      </div>

      <!-- 热门推荐 -->
      <div class="recommend-section" v-if="!searched || results.length === 0">
        <h2 class="section-title">热门诗词</h2>
        <div class="recommend-list">
          <div
            v-for="poem in popularPoems"
            :key="poem.id"
            class="recommend-item"
            @click="viewPoemDetail(poem.id)"
          >
            <div class="poem-card">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <p class="poem-author">{{ poem.author }}</p>
              <p class="poem-excerpt" style="white-space: pre-line;">{{ poem.excerpt.replace(/\\n/g, '\n') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ArrowRight, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { poemApi } from '@/api/poemApi'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const keyword = ref('')
const results = ref<any[]>([])
const popularPoems = ref<any[]>([])
const searched = ref(false)
const loading = ref(false)

const hotKeywords = ['李白', '杜甫', '苏轼', '静夜思', '春晓', '相思']

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  try {
    loading.value = true
    const data = await poemApi.searchPoems(keyword.value)
    results.value = data
    searched.value = true
    console.log('搜索结果:', data) // 调试用
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

const setKeyword = (tag: string) => {
  keyword.value = tag
  handleSearch()
}

const viewPoemDetail = (poemId: string) => {
  router.push(`/poem/${poemId}`)
}

// 切换收藏状态
const toggleFavorite = (poemId: string, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡，避免触发诗词详情跳转
  userStore.toggleFavorite(poemId)
  ElMessage.success(userStore.isFavorite(poemId) ? '收藏成功' : '取消收藏')
}

// 检查是否已收藏
const isFavorite = (poemId: string) => {
  return userStore.isFavorite(poemId)
}

const loadPopularPoems = async () => {
  try {
    const data = await poemApi.getPopularPoems(6)
    popularPoems.value = data
  } catch (error) {
    console.error('加载热门诗词失败:', error)
  }
}

onMounted(() => {
  // 从URL参数中获取搜索关键词
  if (route.query.q) {
    keyword.value = route.query.q as string
    handleSearch()
  }
  loadPopularPoems()
})
</script>

<style scoped lang="scss">
.search {
  min-height: 100vh;
  background: linear-gradient(135deg, #F7F3E8 0%, #F2E9D9 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: var(--shadow);
  
  .search-box {
    margin-bottom: 20px;
  }
  
  .search-tips {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    
    span {
      color: var(--text-light);
      font-size: 14px;
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
}

.results-section {
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      margin: 0;
      color: var(--primary-color);
    }
    
    .results-count {
      color: var(--text-light);
      font-size: 14px;
    }
  }
  
  .results-list {
    .result-item {
      background: #FBF5E6;
      border: 1px solid #E8DEC5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary-color);
      }
      
      .poem-info {
        flex: 1;
        
        .poem-title {
          margin: 0 0 8px;
          color: var(--primary-color);
          font-size: 1.2em;
        }
        
        .poem-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          
          .author {
            font-weight: 600;
            color: var(--text-color);
          }
          
          .dynasty {
            color: var(--text-light);
            font-style: italic;
          }
        }
        
        .poem-excerpt {
          margin: 0;
          color: var(--text-color);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      
      .poem-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .favorite-btn {
          white-space: nowrap;
        }
      }
      
      .arrow-icon {
        color: var(--text-light);
        font-size: 18px;
      }
    }
  }
  
  .no-results {
    background: #FBF5E6;
    border: 1px solid #E8DEC5;
    border-radius: 12px;
    padding: 40px;
  }
}

.recommend-section {
  .section-title {
    color: var(--primary-color);
    margin-bottom: 20px;
    text-align: center;
  }
  
  .recommend-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    
    .recommend-item {
      .poem-card {
        background: #FBF5E6;
        border: 1px solid #E8DEC5;
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-color);
        }
        
        .poem-title {
          margin: 0 0 8px;
          color: var(--primary-color);
          font-size: 1.1em;
        }
        
        .poem-author {
          margin: 0 0 10px;
          color: var(--text-light);
          font-size: 0.9em;
        }
        
        .poem-excerpt {
          margin: 0;
          color: var(--text-color);
          line-height: 1.6;
          font-size: 0.9em;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .search-section {
    padding: 20px;
  }
  
  .recommend-list {
    grid-template-columns: 1fr !important;
  }
}
</style>
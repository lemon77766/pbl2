<template>
  <div class="poem-detail">
    <SiteHeader />

    <div class="container">
      <!-- 返回按钮 -->
      <div class="back-section">
        <el-button type="text" @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>

      <!-- 诗词详情 -->
      <div class="poem-content" v-if="poem">
        <!-- 标题区域 -->
        <div class="poem-header">
          <h1 class="poem-title">{{ poem.title }}</h1>
          <div class="poem-meta">
            <span class="author">{{ poem.author?.name }}</span>
            <span class="dynasty">{{ poem.dynasty }}</span>
          </div>
        </div>

        <!-- 诗词内容 -->
        <div class="poem-text">
          <div class="content-display">
            <p v-for="(line, index) in poem.content.split('\n')" :key="index" class="poem-line">
              {{ line }}
            </p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="poem-actions">
          <el-button 
            type="primary" 
            :icon="isFavorite ? StarFilled : Star" 
            @click="toggleFavorite"
            :loading="favoriteLoading"
          >
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
          <el-button type="info" :icon="Share">分享</el-button>
        </div>

        <!-- 翻译和背景 -->
        <div class="poem-info">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="译文" name="translation">
              <div class="info-content">
                <p>{{ poem.translation || '暂无译文' }}</p>
              </div>
            </el-collapse-item>
            
            <el-collapse-item title="创作背景" name="background">
              <div class="info-content">
                <p>{{ poem.background || '暂无创作背景信息' }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 诗词赏析 -->
        <div class="poem-analysis" v-if="poem.analysis">
          <h3 class="section-title">诗词赏析</h3>
          <div class="analysis-content">
            <p>{{ poem.analysis.analysis_content }}</p>
            
            <div class="artistic-features" v-if="poem.analysis.artistic_features">
              <h4>艺术特色</h4>
              <p>{{ poem.analysis.artistic_features }}</p>
            </div>

            <div class="line-analysis" v-if="poem.analysis.line_analysis">
              <h4>逐句赏析</h4>
              <div v-for="(line, index) in JSON.parse(poem.analysis.line_analysis)" :key="index" class="line-item">
                <div class="line-text">{{ line.text }}</div>
                <div class="line-explanation">{{ line.explanation }}</div>
              </div>
            </div>

            <div class="overall-analysis" v-if="poem.analysis.overall_analysis">
              <h4>整体赏析</h4>
              <p>{{ poem.analysis.overall_analysis }}</p>
            </div>
          </div>
        </div>

        <!-- 作者信息 -->
        <div class="author-info" v-if="poem.author">
          <h3 class="section-title">作者简介</h3>
          <div class="author-content">
            <div class="author-basic">
              <h4>{{ poem.author.name }}</h4>
              <span class="author-dynasty">{{ poem.author.dynasty }}</span>
            </div>
            <p class="author-biography">{{ poem.author.biography }}</p>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-container">
        <el-result icon="error" title="加载失败" :sub-title="error">
          <template #extra>
            <el-button type="primary" @click="loadPoemDetail">重试</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Star, StarFilled, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SiteHeader from '@/components/SiteHeader.vue'
import { poemApi } from '@/api/poemApi'
import { useUserStore } from '@/stores/user'

interface PoemDetail {
  id: string
  title: string
  author_id: string
  dynasty: string
  content: string
  translation?: string
  background?: string
  created_at: string
  updated_at: string
  author?: {
    id: string
    name: string
    biography?: string
    dynasty: string
    created_at: string
    updated_at: string
  }
  analysis?: any
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const poem = ref<PoemDetail | null>(null)
const loading = ref(false)
const error = ref('')
const isFavorite = ref(false)
const favoriteLoading = ref(false)
const activeNames = ref(['translation', 'background'])

const loadPoemDetail = async () => {
  const poemId = route.params.id as string
  if (!poemId) {
    error.value = '诗词ID不存在'
    return
  }

  try {
    loading.value = true
    error.value = ''
    const data = await poemApi.getPoemDetail(poemId)
    poem.value = data
  } catch (err: any) {
    error.value = err.message || '加载诗词详情失败'
    console.error('加载诗词详情失败:', err)
  } finally {
    loading.value = false
  }
}

// 检查收藏状态
const checkFavoriteStatus = () => {
  if (poem.value) {
    isFavorite.value = userStore.isFavorite(poem.value.id)
  }
}

const toggleFavorite = async () => {
  if (!poem.value) return

  try {
    favoriteLoading.value = true
    userStore.toggleFavorite(poem.value.id)
    checkFavoriteStatus()
    ElMessage.success(isFavorite.value ? '收藏成功' : '取消收藏')
  } catch (err) {
    console.error('收藏操作失败:', err)
    ElMessage.error('操作失败')
  } finally {
    favoriteLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

// 监听诗词数据变化，更新收藏状态
watch(poem, () => {
  checkFavoriteStatus()
})

onMounted(() => {
  loadPoemDetail()
})
</script>

<style scoped lang="scss">
.poem-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #F7F3E8 0%, #F2E9D9 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-section {
  margin-bottom: 20px;
}

.back-btn {
  color: var(--primary-color);
  font-weight: 600;
}

.poem-content {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow);
}

.poem-header {
  text-align: center;
  margin-bottom: 30px;
  
  .poem-title {
    margin: 0 0 10px;
    color: var(--primary-color);
    font-size: 2.2em;
    font-weight: 700;
  }
  
  .poem-meta {
    display: flex;
    justify-content: center;
    gap: 20px;
    
    .author {
      font-size: 1.2em;
      color: var(--text-color);
      font-weight: 600;
    }
    
    .dynasty {
      color: var(--text-light);
      font-style: italic;
    }
  }
}

.poem-text {
  margin-bottom: 30px;
  
  .content-display {
    background: #FFF8EE;
    border: 1px solid #E8DEC5;
    border-radius: 8px;
    padding: 25px;
    
    .poem-line {
      margin: 0;
      font-size: 1.1em;
      line-height: 2;
      text-align: center;
      color: var(--text-color);
    }
  }
}

.poem-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.poem-info {
  margin-bottom: 30px;
  
  .info-content {
    padding: 15px;
    background: #FFF8EE;
    border-radius: 6px;
    line-height: 1.8;
  }
}

.poem-analysis,
.author-info {
  margin-bottom: 30px;
  
  .section-title {
    color: var(--primary-color);
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #E8DEC5;
  }
}

.analysis-content {
  line-height: 1.8;
  
  h4 {
    color: var(--text-color);
    margin: 20px 0 10px;
  }
  
  .line-item {
    margin-bottom: 15px;
    
    .line-text {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .line-explanation {
      color: var(--text-color);
      line-height: 1.6;
    }
  }
}

.author-content {
  .author-basic {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    
    h4 {
      margin: 0;
      color: var(--primary-color);
    }
    
    .author-dynasty {
      color: var(--text-light);
      font-style: italic;
    }
  }
  
  .author-biography {
    line-height: 1.8;
    margin: 0;
  }
}

.loading-container,
.error-container {
  background: #FBF5E6;
  border: 1px solid #E8DEC5;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .poem-content {
    padding: 20px;
  }
  
  .poem-title {
    font-size: 1.8em !important;
  }
}
</style>
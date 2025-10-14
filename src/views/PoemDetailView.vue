<template>
  <div class="poem-detail-view">
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

    <main class="main-content">
      <div class="container">
        <!-- 诗词基本信息 -->
        <section class="poem-info">
          <div class="poem-header">
            <h1 class="poem-title">{{ poemData.title }}</h1>
            <p class="poem-author">{{ poemData.author }}</p>
            <div class="poem-actions">
              <el-button 
                type="primary" 
                :icon="Star" 
                @click="toggleFavorite"
                :class="{ 'is-favorite': isFavorite }"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
              <el-button :icon="Share" @click="handleShare">分享</el-button>
              <el-button :icon="VideoPlay" @click="playAudio">朗读</el-button>
            </div>
          </div>

          <!-- 标签页内容 -->
          <el-tabs v-model="activeTab" class="poem-tabs">
            <!-- 原文与译文 -->
            <el-tab-pane label="原文与译文" name="content">
              <div class="poem-content">
                <div class="original-text">
                  <h3>原文</h3>
                  <pre class="poem-text">{{ poemData.content }}</pre>
                </div>
                <div v-if="poemData.translation" class="translation-text">
                  <h3>译文</h3>
                  <p class="translation">{{ poemData.translation }}</p>
                </div>
              </div>
            </el-tab-pane>

            <!-- 创作背景 -->
            <el-tab-pane label="创作背景" name="background">
              <div class="background-content">
                <p>{{ poemData.background }}</p>
              </div>
            </el-tab-pane>

            <!-- 作品赏析 -->
            <el-tab-pane label="作品赏析" name="analysis">
              <div class="analysis-content">
                <h3>逐句解析</h3>
                <div v-for="(line, index) in poemData.lineAnalysis" :key="index" class="line-analysis">
                  <p class="line-text">{{ line.text }}</p>
                  <p class="line-explanation">{{ line.explanation }}</p>
                </div>
                
                <h3>整体赏析</h3>
                <p class="overall-analysis">{{ poemData.overallAnalysis }}</p>
              </div>
            </el-tab-pane>

            <!-- 艺术特色 -->
            <el-tab-pane label="艺术特色" name="artistic">
              <div class="artistic-features">
                <div v-for="feature in poemData.artisticFeatures" :key="feature.type" class="feature-item">
                  <h4>{{ feature.type }}</h4>
                  <p>{{ feature.description }}</p>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>

        <!-- 关键词注解 -->
        <section v-if="poemData.keywords && poemData.keywords.length > 0" class="keywords-section">
          <h3>关键词注解</h3>
          <div class="keywords-list">
            <el-tag 
              v-for="keyword in poemData.keywords" 
              :key="keyword.word"
              class="keyword-tag"
              @click="showKeywordDetail(keyword)"
            >
              {{ keyword.word }}
            </el-tag>
          </div>
        </section>
      </div>
    </main>

    <!-- 关键词详情弹窗 -->
    <el-dialog v-model="keywordDialogVisible" :title="selectedKeyword?.word" width="500px">
      <div class="keyword-detail">
        <p><strong>解释：</strong>{{ selectedKeyword?.explanation }}</p>
        <p v-if="selectedKeyword?.origin"><strong>出处：</strong>{{ selectedKeyword?.origin }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, Share, VideoPlay } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('content')
const isFavorite = ref(false)
const keywordDialogVisible = ref(false)
const selectedKeyword = ref<any>(null)

// 模拟诗词数据
const poemData = ref({
  id: 1,
  title: '静夜思',
  author: '李白',
  content: `床前明月光，疑是地上霜。
举头望明月，低头思故乡。`,
  translation: '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
  background: '这首诗写于唐玄宗开元十四年（726年）九月十五日的扬州旅舍。当时李白26岁，在一个月明星稀的夜晚，诗人抬望天空一轮皓月，思乡之情油然而生，写下了这首传诵千古、中外皆知的名诗。',
  lineAnalysis: [
    {
      text: '床前明月光',
      explanation: '描写月光照射在床前的景象，营造出宁静的夜晚氛围。'
    },
    {
      text: '疑是地上霜',
      explanation: '运用比喻手法，将月光比作霜，既写出了月光的皎洁，又表达了秋夜的寒意。'
    },
    {
      text: '举头望明月',
      explanation: '动作描写，表现诗人仰望明月时的专注和思乡之情。'
    },
    {
      text: '低头思故乡',
      explanation: '直接抒发情感，点明主题，表达对故乡的深切思念。'
    }
  ],
  overallAnalysis: '《静夜思》是唐代诗人李白所作的一首五言古诗。此诗描写了秋日夜晚，旅居在外的诗人于屋内抬头望月而思念家乡的感受。前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉；后两句通过动作神态的刻画，深化思乡之情。全诗运用比喻、衬托等手法，表达客居思乡之情，语言清新朴素而韵味含蓄无穷，历来广为传诵。',
  artisticFeatures: [
    {
      type: '语言特色',
      description: '语言朴素自然，明白如话，体现了李白诗歌"清水出芙蓉，天然去雕饰"的特点。'
    },
    {
      type: '修辞手法',
      description: '运用比喻（"疑是地上霜"）和对比（"举头"与"低头"）等修辞手法。'
    },
    {
      type: '意境营造',
      description: '通过月光、霜等意象，营造出清冷、寂静的秋夜意境。'
    }
  ],
  keywords: [
    {
      word: '明月光',
      explanation: '明亮的月光，象征着纯洁和思乡之情',
      origin: '古代诗词中常用的意象'
    },
    {
      word: '地上霜',
      explanation: '比喻月光洁白如霜，既写实又富有诗意',
      origin: '比喻修辞手法'
    }
  ]
})

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // 这里可以调用收藏API
}

const handleShare = () => {
  // 分享功能实现
  console.log('分享诗词:', poemData.value.title)
}

const playAudio = () => {
  // 朗读功能实现
  console.log('播放朗读音频')
}

const showKeywordDetail = (keyword: any) => {
  selectedKeyword.value = keyword
  keywordDialogVisible.value = true
}

onMounted(() => {
  const poemId = route.params.id
  console.log('加载诗词详情:', poemId)
  // 这里可以根据 poemId 调用API获取诗词详情
})
</script>

<style lang="scss" scoped>
.poem-detail-view {
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

.poem-info {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.poem-header {
  text-align: center;
  margin-bottom: 2rem;

  .poem-title {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }

  .poem-author {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 1.5rem;
  }

  .poem-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;

    .is-favorite {
      background-color: var(--accent-color);
      border-color: var(--accent-color);
    }
  }
}

.poem-tabs {
  margin-top: 2rem;
}

.poem-content {
  .original-text, .translation-text {
    margin-bottom: 2rem;

    h3 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
  }

  .poem-text {
    font-family: 'SimSun', serif;
    font-size: 1.2rem;
    line-height: 2;
    white-space: pre-wrap;
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid var(--primary-color);
  }

  .translation {
    line-height: 1.8;
    font-size: 1.1rem;
    color: var(--text-color);
  }
}

.analysis-content {
  .line-analysis {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);

    .line-text {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .line-explanation {
      color: var(--text-color);
      line-height: 1.6;
    }
  }

  .overall-analysis {
    line-height: 1.8;
    font-size: 1.1rem;
    margin-top: 2rem;
  }
}

.artistic-features {
  .feature-item {
    margin-bottom: 1.5rem;

    h4 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    p {
      line-height: 1.6;
      color: var(--text-color);
    }
  }
}

.keywords-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow);

  h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  .keywords-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .keyword-tag {
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: var(--primary-color);
      color: white;
    }
  }
}

.keyword-detail {
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
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

  .poem-info {
    padding: 1.5rem;
  }

  .poem-title {
    font-size: 2rem !important;
  }

  .poem-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
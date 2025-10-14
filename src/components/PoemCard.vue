<template>
  <el-card class="poem-card" shadow="hover" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="poem-header">
        <h3 class="poem-title">{{ poem.title }}</h3>
        <div class="poem-meta">
          <span class="poem-author">{{ poem.author }}</span>
          <el-tag v-if="poem.dynasty" size="small" type="info">{{ poem.dynasty }}</el-tag>
        </div>
      </div>
    </template>

    <div class="poem-content">
      <p class="poem-excerpt">{{ poem.excerpt || getFirstLine(poem.content) }}</p>
    </div>

    <template #footer>
      <div class="poem-footer">
        <el-button type="primary" text @click="handleViewDetail">查看详情</el-button>
        <el-button v-if="showFavorite" :type="isFavorited ? 'danger' : 'default'" text @click="handleToggleFavorite">
          <el-icon><Star /></el-icon>
          {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { Star } from '@element-plus/icons-vue'

interface Poem {
  id: string
  title: string
  author: string
  content: string
  dynasty?: string
  excerpt?: string
}

interface Props {
  poem: Poem
  showFavorite?: boolean
  isFavorited?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFavorite: true,
  isFavorited: false
})

const emit = defineEmits<{
  viewDetail: [poemId: string]
  toggleFavorite: [poemId: string]
}>()

const getFirstLine = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim())
  return lines[0] ? lines[0].slice(0, 50) + '...' : '暂无内容'
}

const handleViewDetail = () => {
  emit('viewDetail', props.poem.id)
}

const handleToggleFavorite = () => {
  emit('toggleFavorite', props.poem.id)
}
</script>

<style lang="scss" scoped>
.poem-card {
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .poem-header {
    .poem-title {
      margin: 0 0 8px 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .poem-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .poem-author {
        color: var(--text-secondary);
        font-size: 0.875rem;
      }
    }
  }

  .poem-content {
    .poem-excerpt {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.6;
      font-style: italic;
    }
  }

  .poem-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
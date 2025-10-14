<template>
  <div class="search-box">
    <el-input
      v-model="keyword"
      placeholder="请输入诗词名、作者或名句..."
      size="large"
      @input="handleInput"
      @keyup.enter="handleSearch"
    >
      <template #prepend>
        <el-icon><Search /></el-icon>
      </template>
      <template #append>
        <el-button type="primary" @click="handleSearch">
          搜索
        </el-button>
      </template>
    </el-input>

    <!-- 搜索建议 -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions">
      <el-card shadow="always">
        <div class="suggestion-list">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-item"
            @click="handleSuggestionClick(suggestion)"
          >
            <div class="suggestion-title">{{ suggestion.title }}</div>
            <div class="suggestion-author">{{ suggestion.author }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, watch, nextTick } from 'vue'

interface PoemSuggestion {
  id: string
  title: string
  author: string
}

interface Props {
  placeholder?: string
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入诗词名、作者或名句...',
  size: 'large'
})

const emit = defineEmits<{
  search: [keyword: string]
  suggestionClick: [poemId: string]
}>()

const keyword = ref('')
const suggestions = ref<PoemSuggestion[]>([])
const showSuggestions = ref(false)

// 模拟搜索建议数据
const mockSuggestions: PoemSuggestion[] = [
  { id: '1', title: '静夜思', author: '李白' },
  { id: '2', title: '春晓', author: '孟浩然' },
  { id: '3', title: '登鹳雀楼', author: '王之涣' },
  { id: '4', title: '望庐山瀑布', author: '李白' },
  { id: '5', title: '江雪', author: '柳宗元' }
]

const handleInput = () => {
  if (keyword.value.trim()) {
    // 模拟搜索建议
    suggestions.value = mockSuggestions.filter(item =>
      item.title.includes(keyword.value) || item.author.includes(keyword.value)
    )
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
    suggestions.value = []
  }
}

const handleSearch = () => {
  if (keyword.value.trim()) {
    emit('search', keyword.value.trim())
    showSuggestions.value = false
  }
}

const handleSuggestionClick = (suggestion: PoemSuggestion) => {
  emit('suggestionClick', suggestion.id)
  keyword.value = suggestion.title
  showSuggestions.value = false
}

// 点击外部关闭建议框
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.search-box')) {
    showSuggestions.value = false
  }
}

// 监听点击事件
watch(showSuggestions, (newVal) => {
  nextTick(() => {
    if (newVal) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
  })
})
</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    margin-top: 8px;

    .suggestion-list {
      max-height: 300px;
      overflow-y: auto;

      .suggestion-item {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--bg-muted);
        }

        &:last-child {
          border-bottom: none;
        }

        .suggestion-title {
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .suggestion-author {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      }
    }
  }
}
</style>
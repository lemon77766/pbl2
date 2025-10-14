<template>
  <div class="loading-container" v-show="loading">
    <div class="loading-content">
      <div class="spinner">
        <div class="spinner-circle"></div>
        <div class="spinner-text">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '加载中...'
})
</script>

<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-content {
  text-align: center;
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner-circle {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-text {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 诗词主题特殊样式
.loading-container.poem-theme {
  background-color: rgba(139, 69, 19, 0.05);
  
  .spinner-circle {
    border-top-color: var(--primary-color);
  }
  
  .spinner-text {
    color: var(--primary-color);
    font-style: italic;
  }
}

// 小型加载器
.spinner.small {
  .spinner-circle {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }
  
  .spinner-text {
    font-size: 12px;
  }
}

// 大型加载器
.spinner.large {
  .spinner-circle {
    width: 64px;
    height: 64px;
    border-width: 6px;
  }
  
  .spinner-text {
    font-size: 16px;
  }
}
</style>
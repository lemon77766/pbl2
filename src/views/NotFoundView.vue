<template>
  <div class="not-found-view">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-description">抱歉，您访问的页面不存在或已被移除。</p>
      <div class="action-buttons">
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button @click="$router.go(-1)">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-content {
  text-align: center;
  padding: 2rem;
  max-width: 500px;

  .error-code {
    font-size: 8rem;
    font-weight: bold;
    color: var(--primary-color);
    line-height: 1;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 2rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }

  .error-description {
    font-size: 1.1rem;
    color: var(--text-light);
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .not-found-content {
    .error-code {
      font-size: 6rem;
    }

    .error-title {
      font-size: 1.5rem;
    }

    .action-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
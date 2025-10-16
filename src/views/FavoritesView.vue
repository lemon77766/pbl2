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
      <div class="empty">暂未实现收藏数据存储，先作为页面占位。后续可接入本地存储或后台。</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
</script>

<style scoped lang="scss">
.page-header {
  background: #FBF5E6; border-bottom: 1px solid #E8DEC5;
  .container { max-width: 1200px; margin: 0 auto; padding: 28px 20px; }
  h1 { margin: 0 0 6px; color: var(--primary-color); letter-spacing: 4px; }
  p { margin: 0; color: var(--text-light); }
}
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.empty { color: var(--text-light); background: #FBF5E6; border: 1px solid #E8DEC5; padding: 16px; border-radius: 12px; }
</style>
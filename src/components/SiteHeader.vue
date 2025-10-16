<template>
  <header class="nav">
    <div class="container">
      <div class="brand">中国诗词</div>
      <nav class="links">
        <router-link to="/" class="nav-link" exact-active-class="router-link-active">诗词首页</router-link>
        <router-link to="/history" class="nav-link">诗词历史</router-link>
        <router-link to="/appreciation" class="nav-link">诗词鉴赏</router-link>

        <router-link to="/favorites" class="nav-link">我的收藏</router-link>
      </nav>
      <div class="search">
        <el-input v-model="keyword" size="small" placeholder="搜索诗词/作者..." @keyup.enter="goSearch">
          <template #append>
            <el-button :icon="Search" @click="goSearch" />
          </template>
        </el-input>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const keyword = ref('')

const goSearch = () => {
  if (!keyword.value.trim()) return
  router.push({ path: '/search', query: { q: keyword.value.trim() } })
}
</script>

<style scoped lang="scss">
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(247,243,232,0.9); /* 与系统协调的米色 */
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
    display: grid;
    grid-template-columns: 160px 1fr 280px;
    align-items: center;
    gap: 16px;
  }

  .brand {
    font-weight: 700;
    color: var(--primary-color);
    letter-spacing: 2px;
  }

  .links {
    display: flex;
    gap: 18px;
    .nav-link, a.nav-link {
      color: var(--text-color);
      text-decoration: none;
      padding: 6px 10px;
      border-radius: 6px;
      transition: .2s;
    }
    /* 统一访问后样式，避免紫色与下划线 */
    .nav-link:visited,
    a.nav-link:visited {
      color: var(--text-color);
      text-decoration: none;
    }
    .nav-link.router-link-active,
    .nav-link:hover,
    a.nav-link:hover {
      color: var(--primary-color);
      background: color-mix(in oklab, var(--primary-color) 12%, transparent);
    }
  }

  .search :deep(.el-input) {
    --el-input-border-color: var(--border-color);
    --el-input-hover-border-color: var(--primary-color);
  }
}
@media (max-width: 768px) {
  .nav .container {
    grid-template-columns: 1fr;
  }
}
</style>
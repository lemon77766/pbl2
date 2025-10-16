<template>
  <div class="home">
    <!-- 顶部导航（复用组件） -->
    <SiteHeader />

    <!-- 横幅 Hero -->
    <section class="hero">
      <div class="hero-inner">
        <h1>古韵诗语</h1>
        <p>探索中华古典诗词的无限魅力</p>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <el-input
            v-model="keyword"
            placeholder="搜索诗词、作者或关键词..."
            size="large"
            @keyup.enter="goSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button 
            type="primary" 
            size="large" 
            @click="goSearch"
            class="search-btn"
          >
            搜索
          </el-button>
        </div>
      </div>
      <div class="ink-bg" aria-hidden="true"></div>
    </section>

    <!-- 中国诗词 介绍 -->
    <section class="intro">
      <div class="container intro-grid">
        <div class="intro-image" role="img" aria-label="水墨梅花"></div>
        <div class="intro-content">
          <div class="intro-badge">中国诗词</div>
          <p>
            古典诗词，是中华文明审美与智慧的载体。它凝练如月，清澈如泉，寄意于山水风物，传情于四时流转。我们以现代的交互与清新的视觉，邀请你在数字世界里重温文字的光芒：读其字、悟其意、赏其韵、近其人。
          </p>
          <p>
            在这里，你可以浏览名家名篇、了解创作背景、欣赏书法碑帖，也能搜寻一句触动心弦的诗句。愿你在字里行间，遇见自我。
          </p>
          <el-button type="primary" class="intro-btn" @click="goExplore">更多内容</el-button>
        </div>
      </div>
      <div class="quote">山重水复疑无路，柳暗花明又一村。</div>
    </section>

    <!-- 诗词鉴赏 -->
    <section class="gallery">
      <div class="container">
        <div class="section-title">诗词鉴赏</div>
        <div class="cards">
          <div v-for="item in gallery" :key="item.title" class="card">
            <div class="thumb" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
            <button class="fav-btn" aria-label="收藏">❤</button>
            <div class="meta">
              <div class="title">{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
        </div>
        <div class="more">
          <el-button type="primary" plain @click="goExplore">查看更多</el-button>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col brand">
            <h3 class="footer-title">古韵诗语</h3>
            <p class="footer-desc">致力于传承中华古典诗词文化，为诗词爱好者提供高质量的鉴赏与学习平台。</p>
          </div>

          <div class="footer-col">
            <h4 class="footer-subtitle">快捷链接</h4>
            <ul class="footer-links">
              <li><a href="/">首页</a></li>
              <li><a href="/">诗词列表</a></li>
              <li><a href="/">互动学习</a></li>
              <li><a href="/">我的收藏</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-subtitle">关于我们</h4>
            <ul class="footer-links">
              <li><a href="/">项目介绍</a></li>
              <li><a href="/">团队成员</a></li>
              <li><a href="/">联系我们</a></li>
              <li><a href="/">版权声明</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-subtitle">关注我们</h4>
            <div class="socials">
              <a href="#" aria-label="抖音" class="soc">抖</a>
              <a href="#" aria-label="微信" class="soc">微</a>
              <a href="#" aria-label="微博" class="soc">博</a>
            </div>
            <p class="qr-tip">扫码关注公众号获取最新资讯</p>
          </div>
        </div>

        <div class="footer-sep"></div>
        <div class="footer-bottom">
          <span>© {{ new Date().getFullYear() }} 中国诗词 • 保留所有权利</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import SiteHeader from '@/components/SiteHeader.vue'

const router = useRouter()
const keyword = ref('')

const goSearch = () => {
  if (!keyword.value.trim()) return
  router.push({ path: '/search', query: { q: keyword.value.trim() } })
}

const goExplore = () => {
  router.push('/')
}

const gallery = [
  { title: '观书法', desc: '帖学流韵，笔意生动', img: '/images/gallery1.jpg' },
  { title: '品唐风', desc: '盛唐气象，雄浑飘逸', img: '/images/gallery2.jpg' },
  { title: '赏宋词', desc: '清婉细腻，小令婀娜', img: '/images/gallery3.jpg' },
  { title: '踏山水', desc: '烟岚云岫，月白风清', img: '/images/gallery4.jpg' },
  { title: '寻名句', desc: '一字千金，回味无穷', img: '/images/gallery5.jpg' }
]
</script>

<style lang="scss" scoped>
.home {
  color: var(--text-color);
}

/* 顶部导航样式由 SiteHeader 组件提供 */

/* 横幅 */
.hero {
  position: relative;
  overflow: hidden;
  background: url("/images/hero-banner.jpg") top center no-repeat;
  background-size: cover;
  min-height: 400px; /* 增加高度以容纳搜索框 */
  margin-bottom: 32px; /* 与下方内容留白 */
  .hero-inner {
    padding: 80px 20px 100px;
    text-align: center;
    h1 {
      margin: 0 0 10px;
      font-size: 40px;
      color: var(--primary-color);
      letter-spacing: 1px;
    }
    p {
      margin: 0 0 30px;
      color: var(--text-light);
      font-size: 16px;
    }
    
    .search-container {
      display: flex;
      justify-content: center;
      gap: 12px;
      max-width: 600px;
      margin: 0 auto;
      
      :deep(.el-input) {
        flex: 1;
      }
      
      .search-btn {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        
        &:hover {
          background-color: #8B6B3D;
          border-color: #8B6B3D;
        }
      }
    }
  }
  .ink-bg { display: none; }
}

/* 介绍 */
.intro {
  .intro-grid {
    max-width: 1100px;
    margin: 24px auto 0; /* 由负值改为正值，避免覆盖横幅 */
    padding: 24px;
    background: #FBF5E6; /* 更浅的米黄背景 */
    border: 1px solid #E8DEC5; /* 更黄一些的描边 */
    border-radius: 16px;
    box-shadow: var(--shadow);
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 24px;
  }

  .intro-image {
    border-radius: 12px;
    background:
      linear-gradient(180deg, rgba(156,123,62,.08), rgba(214,179,112,.05)),
      url('/images/poem.png') center/cover no-repeat;
    min-height: 260px;
  }

  .intro-content {
    .intro-badge {
      display: inline-block;
      margin-bottom: 10px;
      padding: 6px 12px;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      color: var(--primary-color);
      font-weight: 600;
      letter-spacing: 2px;
      background: #F6EBD2; /* 更浅的黄 */
    }
    p { color: var(--text-color); line-height: 1.8; margin: 0 0 10px; }
    .intro-btn { margin-top: 6px; background-color: var(--primary-color); border-color: var(--primary-color); }
  }

  .quote {
    text-align: center;
    color: var(--text-light);
    padding: 20px 0 6px;
  }
}

/* 鉴赏卡片 */
.gallery {
  padding: 30px 0 50px;

  .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

  .section-title {
    text-align: center;
    letter-spacing: 6px;
    color: var(--primary-color);
    margin-bottom: 18px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(5, minmax(160px, 1fr));
    gap: 14px;

    .card {
      position: relative;
      background: #FBF5E6; /* 与上方介绍卡片一致 */
      border: 1px solid #E8DEC5; /* 与整体一致的浅黄描边 */
      border-radius: 10px;
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: .25s ease;
      cursor: pointer;

      &:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }

      .thumb {
        aspect-ratio: 4/3;
        background-size: cover;
        background-position: center;
        filter: saturate(.9);
      }
      .meta {
        padding: 10px 12px 12px;
        .title { font-weight: 600; color: var(--text-color); margin-bottom: 4px; }
        .desc { color: var(--text-light); font-size: 12px; }
      }
    }
  }

  .more { text-align: center; margin-top: 16px; }

  /* 统一“查看更多”按钮为土金主题（Element Plus 覆盖） */
  .more :deep(.el-button.is-plain.el-button--primary) {
    --el-color-primary: var(--primary-color);
    color: var(--primary-color);
    border-color: #E8DEC5;
    background-color: #FBF5E6;
  }
  .more :deep(.el-button.is-plain.el-button--primary:hover),
  .more :deep(.el-button.is-plain.el-button--primary:focus) {
    color: var(--primary-color);
    border-color: #E8DEC5;
    background-color: #F6EBD2;
    box-shadow: var(--shadow);
  }

  .fav-btn {
    position: absolute; right: 10px; bottom: 10px;
    width: 32px; height: 32px; border-radius: 50%;
    border: 1px solid #E8DEC5; background: #FFF8EE; color: #B0894F;
    display: inline-flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow); cursor: pointer; transition: .2s; line-height: 1;
  }
  .fav-btn:hover { background: #F6EBD2; color: var(--primary-color); }
}

.site-footer {
  background: #2F281B; /* 暖棕深色 */
  color: #F1EAD9;      /* 米金文字 */
  padding: 40px 0 24px;
  margin-top: 32px;

  .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 24px;
  }

  .footer-title {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
    color: #FFF7E3;
  }
  .footer-desc {
    margin: 0;
    color: #E3D9C3;
    line-height: 1.7;
  }

  .footer-subtitle {
    margin: 0 0 10px;
    color: #FFF3CC;
    font-weight: 600;
    font-size: 16px;
  }

  .footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
    li { margin: 8px 0; }
    a {
      color: #EADFC7;
      text-decoration: none;
      transition: .2s;
      &:hover { color: #FFF7E3; }
    }
  }

  .socials {
    display: flex;
    gap: 10px;
    margin: 6px 0 8px;
    .soc {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #3A2F1F;      /* 暖棕圆标底 */
      color: #F1EAD9;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid #4A3B24;
      transition: .2s;
      &:hover { background: #4A3B24; }
    }
  }

  .qr-tip { color: #E3D9C3; font-size: 12px; margin: 4px 0 0; }

  .footer-sep {
    height: 1px;
    background: #4A3B24;
    margin: 24px 0 12px;
  }

  .footer-bottom {
    color: #E3D9C3;
    font-size: 12px;
    text-align: center;
  }
}

@media (max-width: 1024px) {
  .site-footer .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 640px) {
  .site-footer .footer-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 1024px) {
  .gallery .cards { grid-template-columns: repeat(3, 1fr); }
  .intro .intro-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .gallery .cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
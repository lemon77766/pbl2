<template>
  <div class="appreciation">
    <SiteHeader />

    <header class="page-header">
      <div class="container">
        <h1>诗词鉴赏</h1>
        <p>精选名篇与主题赏析，体味意境与章法之美。</p>
      </div>
    </header>

    <main class="container main">
      <!-- 筛选区 -->
      <section class="filters">
        <div class="chip-group">
          <span class="chip-label">体裁</span>
          <button class="chip" :class="{active: activeGenre==='全部'}" @click="setGenre('全部')">全部</button>
          <button class="chip" v-for="g in genres" :key="g" :class="{active: activeGenre===g}" @click="setGenre(g)">{{ g }}</button>
        </div>
        <div class="chip-group">
          <span class="chip-label">朝代</span>
          <button class="chip" :class="{active: activeEra==='全部'}" @click="setEra('全部')">全部</button>
          <button class="chip" v-for="e in eras" :key="e" :class="{active: activeEra===e}" @click="setEra(e)">{{ e }}</button>
        </div>
        <div class="chip-group">
          <span class="chip-label">风格</span>
          <button class="chip" :class="{active: activeStyle==='全部'}" @click="setStyle('全部')">全部</button>
          <button class="chip" v-for="s in styles" :key="s" :class="{active: activeStyle===s}" @click="setStyle(s)">{{ s }}</button>
        </div>
      </section>

      <!-- 鉴赏卡片 -->
      <section class="grid">
        <article v-for="item in filtered" :key="item.id" class="card">
          <div class="thumb" :style="{ backgroundImage: 'url(' + item.img + ')' }"></div>
          <button class="fav-btn" aria-label="收藏">❤</button>
          <div class="meta">
            <div class="title">{{ item.title }}</div>
            <div class="sub">{{ item.author }} · {{ item.era }} · {{ item.genre }}</div>
            <p class="excerpt">“{{ item.quote }}”</p>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SiteHeader from '@/components/SiteHeader.vue'

type Item = {
  id: number
  title: string
  author: string
  era: string
  genre: string
  style: string
  quote: string
  img: string
}

const genres = ['绝句', '律诗', '宋词', '元曲']
const eras   = ['先秦', '汉魏', '唐', '宋', '元', '明', '清', '近现代']
const styles = ['山水', '边塞', '豪放', '婉约']

const activeGenre = ref<'全部'|string>('全部')
const activeEra   = ref<'全部'|string>('全部')
const activeStyle = ref<'全部'|string>('全部')

const setGenre = (v: string) => (activeGenre.value = v)
const setEra   = (v: string) => (activeEra.value = v)
const setStyle = (v: string) => (activeStyle.value = v)

const getImageUrl = (name: string) => {
  return new URL(`../../images/${name}`, import.meta.url).href
}

const data: Item[] = [
  { id: 1, title: '春江花月夜', author: '张若虚', era: '唐', genre: '律诗', style: '山水', quote: '江天一色无纤尘，皎皎空中孤月轮', img: getImageUrl('like1.png') },
  { id: 2, title: '登鹳雀楼', author: '王之涣', era: '唐', genre: '绝句', style: '边塞', quote: '欲穷千里目，更上一层楼', img: getImageUrl('like2.png') },
  { id: 3, title: '水调歌头', author: '苏轼', era: '宋', genre: '宋词', style: '豪放', quote: '但愿人长久，千里共婵娟', img: getImageUrl('like3.png') },
  { id: 4, title: '青玉案·元夕', author: '辛弃疾', era: '宋', genre: '宋词', style: '婉约', quote: '众里寻他千百度，蓦然回首，那人却在，灯火阑珊处', img: getImageUrl('like4.png') },
  { id: 5, title: '天净沙·秋思', author: '马致远', era: '元', genre: '元曲', style: '婉约', quote: '枯藤老树昏鸦，小桥流水人家', img: getImageUrl('like5.png') }
]

const filtered = computed(() => {
  return data.filter(i =>
    (activeGenre.value === '全部' || i.genre === activeGenre.value) &&
    (activeEra.value   === '全部' || i.era   === activeEra.value) &&
    (activeStyle.value === '全部' || i.style === activeStyle.value)
  )
})
</script>

<style scoped lang="scss">
.appreciation { color: var(--text-color); }

/* 页眉与全局容器 */
.page-header {
  background: #FBF5E6;
  border-bottom: 1px solid #E8DEC5;
  .container { max-width: 1200px; margin: 0 auto; padding: 28px 20px; }
  h1 { margin: 0 0 6px; color: var(--primary-color); letter-spacing: 4px; }
  p  { margin: 0; color: var(--text-light); }
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 筛选区（统一土金配色） */
.filters {
  background: #FBF5E6; border: 1px solid #E8DEC5; border-radius: 12px; padding: 14px; margin: 20px 0;
  box-shadow: var(--shadow);
}
.chip-group { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 6px 0; }
.chip-label { color: var(--primary-color); font-weight: 600; margin-right: 4px; }
.chip {
  background: #F6EBD2; border: 1px solid #E8DEC5; color: var(--text-color);
  border-radius: 999px; padding: 6px 12px; font-size: 12px; cursor: pointer; transition: .2s;
}
.chip.active, .chip:hover { background: #EEDDBB; }

/* 卡片栅格（与首页一致） */
.grid {
  display: grid; gap: 14px;
  grid-template-columns: repeat(5, minmax(160px, 1fr));
  margin: 10px 0 40px;
}
.card {
  position: relative;
  background: #FBF5E6; border: 1px solid #E8DEC5; border-radius: 10px; overflow: hidden;
  box-shadow: var(--shadow); transition: .25s ease; cursor: pointer;
}
.card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.thumb { aspect-ratio: 4/3; background-size: cover; background-position: center; }
.meta { padding: 10px 12px 12px; }
.title { font-weight: 700; color: var(--text-color); }
.sub { color: var(--text-light); font-size: 12px; margin-top: 2px; }
.excerpt { color: var(--text-color); font-size: 13px; margin: 8px 0 0; }

.fav-btn {
  position: absolute; right: 10px; bottom: 10px;
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid #E8DEC5; background: #FFF8EE; color: #B0894F;
  display: inline-flex; align-items: center; justify-content: center;
  box-shadow: var(--shadow); cursor: pointer; transition: .2s; line-height: 1;
}
.fav-btn:hover { background: #F6EBD2; color: var(--primary-color); }

/* 响应式 */
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px)  { .grid { grid-template-columns: repeat(2, 1fr); } }
</style>
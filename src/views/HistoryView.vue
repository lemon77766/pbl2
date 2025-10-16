<template>
  <div class="history">
    <SiteHeader />
    <header class="page-header">
      <div class="container">
        <h1>诗词历史</h1>
        <p>溯源中华诗词的演进脉络，纵览千年文心之光。</p>
      </div>
    </header>

    <main class="container main">
      <aside class="toc">
        <div class="toc-box">
          <div class="toc-title">朝代目录</div>
          <ul>
            <li v-for="e in eras" :key="e.id"><a :href="'#'+e.id">{{ e.name }}</a></li>
          </ul>
        </div>
      </aside>

      <section class="content">
        <section
          v-for="e in eras"
          :key="e.id"
          class="era"
          :id="e.id"
        >
          <div class="era-head">
            <div class="era-badge">{{ e.name }}</div>
            <div class="era-meta">{{ e.period }}</div>
          </div>

          <div class="era-body">
            <div class="era-media" :style="{ backgroundImage: 'url(' + e.image + ')' }" />
            <div class="era-text">
              <p class="desc">{{ e.description }}</p>
              <div class="chips">
                <span class="chip" v-for="tag in e.tags" :key="tag">{{ tag }}</span>
              </div>
              <div class="meta-grid">
                <div>
                  <h4>代表诗人</h4>
                  <p class="muted">{{ e.poets }}</p>
                </div>
                <div>
                  <h4>典型体裁</h4>
                  <p class="muted">{{ e.genres }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div class="end-tip">以上内容为简版时间轴，你可继续扩展史料与作品链接。</div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
type Era = {
  id: string
  name: string
  period: string
  description: string
  tags: string[]
  poets: string
  genres: string
  image: string
}

const eras: Era[] = [
  {
    id: 'pre-qin',
    name: '先秦',
    period: '公元前11世纪 — 前221年',
    description:
      '《诗经》与楚辞并峙，风雅颂与骚体开古典诗歌之源，质朴而含蓄，礼乐与民歌相融。',
    tags: ['诗经', '楚辞', '雅颂', '骚体'],
    poets: '屈原、宋玉',
    genres: '四言诗、骚体',
    image:
      '/images/history-pre-qin.jpg'
  },
  {
    id: 'han-wei',
    name: '汉魏六朝',
    period: '前202年 — 589年',
    description:
      '乐府兴盛，建安风骨慷慨悲凉，山水诗萌芽，玄言清谈影响审美取向。',
    tags: ['乐府', '建安风骨', '山水诗'],
    poets: '曹操、曹丕、曹植、谢灵运',
    genres: '乐府诗、五言诗',
    image:
      '/images/history-han-wei.jpg'
  },
  {
    id: 'tang',
    name: '唐',
    period: '618 — 907',
    description:
      '近体诗臻于成熟，盛唐豪放、晚唐精致，群星灿烂，成为古典诗歌高峰。',
    tags: ['近体诗', '盛唐', '边塞', '山水'],
    poets: '李白、杜甫、王维、白居易',
    genres: '五律、七律、绝句',
    image:
      '/images/history-tang.jpg'
  },
  {
    id: 'song',
    name: '宋',
    period: '960 — 1279',
    description:
      '词体大盛，婉约与豪放并峙，议论入诗，意境深远，格律与文心并重。',
    tags: ['宋词', '婉约', '豪放', '理趣'],
    poets: '苏轼、辛弃疾、李清照、柳永',
    genres: '小令、中调、长调',
    image:
      '/images/history-song.jpg'
  },
  {
    id: 'yuan',
    name: '元',
    period: '1271 — 1368',
    description:
      '曲体兴起，杂剧与散曲并举，语言质朴生动，抒写真情与世态人情。',
    tags: ['元曲', '杂剧', '散曲'],
    poets: '关汉卿、马致远、王实甫',
    genres: '小令、套数',
    image:
      '/images/history-yuan.jpg'
  },
  {
    id: 'ming',
    name: '明',
    period: '1368 — 1644',
    description:
      '台阁体与前后七子追古尚法，公安派与竟陵派提倡性灵、独抒性灵。',
    tags: ['复古', '性灵'],
    poets: '高启、王世贞、袁宏道',
    genres: '律诗、绝句、杂体',
    image:
      '/images/history-ming.jpg'
  },
  {
    id: 'qing',
    name: '清',
    period: '1636 — 1912',
    description:
      '格调趋雅，流派纷呈，考据学盛，词体亦繁荣，纳兰性德情词动人。',
    tags: ['格调', '词学', '考据'],
    poets: '纳兰性德、龚自珍、黄遵宪',
    genres: '近体诗、词',
    image:
      '/images/history-qing.jpg'
  },
  {
    id: 'modern',
    name: '近现代',
    period: '1912 — 至今',
    description:
      '新诗兴起，白话表达拓展诗歌边界，同时古典诗词传统在现代语境中不断传承与创新。',
    tags: ['新诗', '白话', '传承与创新'],
    poets: '闻一多、徐志摩、余光中',
    genres: '自由诗、旧体新作',
    image:
      '/images/history-modern.jpg'
  }
]
</script>

<style scoped lang="scss">
.history { color: var(--text-color); }

/* 顶部页眉 */
.page-header {
  background: #FBF5E6;
  border-bottom: 1px solid #E8DEC5;
  .container {
    max-width: 1200px; margin: 0 auto; padding: 28px 20px;
  }
  h1 { margin: 0 0 6px; color: var(--primary-color); letter-spacing: 4px; }
  p  { margin: 0; color: var(--text-light); }
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.main {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  margin: 24px 0 40px;
}

/* 目录 */
.toc {
  position: sticky; top: 88px; height: fit-content;
  .toc-box {
    background: #FBF5E6; border: 1px solid #E8DEC5; border-radius: 12px; padding: 14px;
    box-shadow: var(--shadow);
  }
  .toc-title { font-weight: 600; color: var(--primary-color); margin-bottom: 8px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { margin: 6px 0; }
  a { color: var(--text-color); text-decoration: none; }
  a:hover { color: var(--primary-color); }
}

/* 内容区 */
.content { display: grid; gap: 20px; }

.era {
  background: #FBF5E6; /* 与首页卡片一致的浅米黄 */
  border: 1px solid #E8DEC5;
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 16px;
}

.era-head {
  display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px;
  .era-badge {
    background: #F6EBD2; color: var(--primary-color);
    padding: 6px 12px; border-radius: 999px; border: 1px solid #E8DEC5;
    font-weight: 700; letter-spacing: 2px;
  }
  .era-meta { color: var(--text-light); font-size: 14px; }
}

.era-body {
  display: grid; grid-template-columns: 360px 1fr; gap: 16px;
}

.era-media {
  border-radius: 12px; aspect-ratio: 4/3; background-size: cover; background-position: center;
  border: 1px solid #E8DEC5;
}

.era-text .desc { margin: 0 0 10px; line-height: 1.8; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.chip {
  background: #FBF5E6; border: 1px solid #E8DEC5; color: var(--text-color);
  border-radius: 999px; padding: 4px 10px; font-size: 12px;
}

.meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;
  h4 { margin: 0 0 6px; color: var(--primary-color); }
  .muted { margin: 0; color: var(--text-light); }
}

.end-tip {
  text-align: center; color: var(--text-light); margin-top: 10px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main { grid-template-columns: 1fr; }
  .toc { position: static; order: 2; }
  .content { order: 1; }
  .era-body { grid-template-columns: 1fr; }
}
</style>
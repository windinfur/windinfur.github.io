<script setup>
import { articles } from '../content/articles'

const posts = articles

const tools = [
  { title: '即将发布', desc: '自己写的小工具会陆续放上来。', tag: '工具' },
]

const demos = [
  {
    title: '修狗巨人',
    desc: 'HTML5 Canvas 小游戏，支持键盘与触屏虚拟摇杆操作。',
    tag: 'Demo',
    href: '/game.html',
  },
]
</script>

<template>
  <main>
    <section class="hero">
      <p class="hero-eyebrow">学不可以已</p>
      <h1 class="hero-title">不可以已</h1>
      <p class="hero-desc">
        记录技术与思考，分享自己写的小工具和 Demo。<br />
        学不可以已 —— 保持好奇，持续折腾。
      </p>
    </section>

    <section id="posts" class="section">
      <h2 class="section-title">文章</h2>
      <div v-if="posts.length" class="cards">
        <router-link
          v-for="post in posts"
          :key="post.slug"
          :to="`/article/${post.slug}`"
          class="card card-link"
        >
          <span class="card-tag">{{ post.tags[0] || '文章' }}</span>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-desc">{{ post.desc }}</p>
          <time v-if="post.date" class="card-date">{{ post.date }}</time>
        </router-link>
      </div>
      <p v-else class="section-empty">文章正在整理中，敬请期待。</p>
    </section>

    <section id="tools" class="section">
      <h2 class="section-title">小工具</h2>
      <div class="cards">
        <article v-for="tool in tools" :key="tool.title" class="card">
          <span class="card-tag">{{ tool.tag }}</span>
          <h3 class="card-title">{{ tool.title }}</h3>
          <p class="card-desc">{{ tool.desc }}</p>
        </article>
      </div>
    </section>

    <section id="demos" class="section">
      <h2 class="section-title">Demo</h2>
      <div class="cards">
        <a v-for="demo in demos" :key="demo.title" :href="demo.href" class="card card-link">
          <span class="card-tag">{{ demo.tag }}</span>
          <h3 class="card-title">{{ demo.title }}</h3>
          <p class="card-desc">{{ demo.desc }}</p>
        </a>
      </div>
    </section>
  </main>
</template>

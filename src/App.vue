<script setup>
const nav = [
  { name: '首页', href: '/' },
  { name: '文章', href: '#posts' },
  { name: '工具', href: '#tools' },
  { name: 'Demo', href: '#demos' },
]

const posts = [
  { title: '即将发布', desc: '技术文章正在整理中，敬请期待。', tag: '文章' },
]

const tools = [
  { title: '即将发布', desc: '自己写的小工具会陆续放上来。', tag: '工具' },
]

const demos = [
  { title: '即将发布', desc: '各种好玩的 Demo 会记录在这里。', tag: 'Demo' },
]
</script>

<template>
  <div class="page">
    <header class="site-header">
      <a class="brand" href="/">不可以已</a>
      <nav class="nav">
        <a v-for="item in nav" :key="item.name" :href="item.href">{{ item.name }}</a>
      </nav>
    </header>

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
        <div class="cards">
          <article v-for="p in posts" :key="p.title" class="card">
            <span class="card-tag">{{ p.tag }}</span>
            <h3 class="card-title">{{ p.title }}</h3>
            <p class="card-desc">{{ p.desc }}</p>
          </article>
        </div>
      </section>

      <section id="tools" class="section">
        <h2 class="section-title">小工具</h2>
        <div class="cards">
          <article v-for="t in tools" :key="t.title" class="card">
            <span class="card-tag">{{ t.tag }}</span>
            <h3 class="card-title">{{ t.title }}</h3>
            <p class="card-desc">{{ t.desc }}</p>
          </article>
        </div>
      </section>

      <section id="demos" class="section">
        <h2 class="section-title">Demo</h2>
        <div class="cards">
          <article v-for="d in demos" :key="d.title" class="card">
            <span class="card-tag">{{ d.tag }}</span>
            <h3 class="card-title">{{ d.title }}</h3>
            <p class="card-desc">{{ d.desc }}</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>不可以已 · 学不可以已</p>
    </footer>
  </div>
</template>

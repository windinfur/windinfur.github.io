<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { getArticleBySlug } from '../content/articles'

const route = useRoute()
const md = new MarkdownIt({ html: false, linkify: true })

const article = computed(() => getArticleBySlug(String(route.params.slug)))
const rendered = computed(() => (article.value ? md.render(article.value.content) : ''))
</script>

<template>
  <main class="article-page">
    <router-link to="/" class="back-link">← 返回首页</router-link>

    <template v-if="article">
      <article>
        <header class="article-header">
          <h1>{{ article.title }}</h1>
          <p class="article-meta">
            <time v-if="article.date">{{ article.date }}</time>
            <span v-if="article.tags.length" class="article-tags">
              <em v-for="tag in article.tags" :key="tag">{{ tag }}</em>
            </span>
          </p>
        </header>
        <div class="article-body" v-html="rendered"></div>
      </article>
    </template>

    <p v-else class="article-empty">这篇文章不存在或已被移除。</p>
  </main>
</template>

<template>
  <div class="page">
    <header class="site-header">
      <router-link to="/" class="brand">不可以已</router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <a href="/#posts">文章</a>
        <a href="/#tools">工具</a>
        <a href="/#demos">Demo</a>
      </nav>
    </header>

    <router-view />

    <footer class="site-footer">
      <p>不可以已 · 学不可以已</p>
    </footer>
  </div>
</template>

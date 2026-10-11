---
title: Astro 岛屿架构入门
date: 2026-10-02
summary: 为什么内容站适合用 Astro：默认零 JavaScript，需要交互的地方才加载。
tags: [Astro, 前端]
---

## 什么是岛屿架构

Astro 的岛屿架构，简单说就是「默认不加载 JavaScript」。页面在构建时就被渲染成静态 HTML，只有你显式标记的交互组件，才会在浏览器里被激活成一座座独立的小岛。

## 为什么值得用

对博客这类以内容为主的站点，它几乎是最优解：首屏快、SEO 友好、分享卡片正常，而需要交互的地方依然可以用熟悉的框架来写。

```bash
npm create astro@latest
npx astro add vue
```

> 默认零 JavaScript，需要交互的地方才加载。

## 迁移成本

旧的 Vue 组件基本能直接复用，只需要决定哪些组件要加 `client:visible` 之类的加载指令。

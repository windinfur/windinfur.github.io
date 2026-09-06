# 不可以已

学不可以已 —— 一个记录技术、分享工具与 Demo 的个人博客。

线上地址：<https://windinfur.github.io/>

## 写文章

每篇文章就是一个 Markdown 文件，放在 `src/content/articles/`：

```md
---
title: 文章标题
date: 2026-09-06
tags: [Vue3, 部署]
desc: 首页卡片上显示的简介
---

正文用 Markdown 写。
```

文件名就是网址，例如 `first-post.md` 对应 `/article/first-post`。首页列表会自动读取，写完推送 `master` 即可自动上线。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与部署

```bash
npm run build
npm run preview   # 本地预览构建产物
```

- 通过 GitHub Actions 自动部署到 GitHub Pages。
- 仓库 Settings → Pages 的 Source 需为 **GitHub Actions**（已配置好，请勿改回分支部署）。
- 站点地址：https://windinfur.github.io/

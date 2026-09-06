# 不可以已 · 个人博客

个人博客「不可以已」（学不可以已）。记录技术、分享自己写的小工具和 Demo。

- 线上地址：https://windinfur.github.io/
- 仓库：windinfur/windinfur.github.io（默认分支 master）

## 技术栈

- Vue 3 + Vite 5（纯 JS，非 TS）
- vue-router 4（history 模式，只有首页和文章页两条路由）
- markdown-it：构建时把 Markdown 渲染成 HTML
- 纯 CSS，无 UI 框架

## 常用命令

```bash
npm install       # 安装依赖
npm run dev       # 本地开发 http://localhost:5173
npm run build     # 构建到 dist/，并生成 dist/404.html
npm run preview   # 本地预览构建产物
```

## 发布文章（核心流程）

1. 在 `src/content/articles/` 新建一个 `.md` 文件。
2. 文件顶部写 frontmatter（三行 `---` 包裹）：

   ```md
   ---
   title: 文章标题
   date: 2026-09-06
   tags: [Vue3, 部署]
   desc: 首页卡片上显示的简介
   ---

   正文从这里开始，用 Markdown 写。
   ```

3. 文件名就是文章网址：`first-post.md` → `/article/first-post`。
4. 首页「文章」板块自动读取目录下所有 `.md`，按 `date` 倒序展示，**无需手动登记**。
5. 提交并推送 `master` 即自动构建部署。

## 目录结构

```
├── index.html              # 入口
├── vite.config.js          # base: '/'（GitHub Pages 用户主页根路径）
├── package.json            # build = vite build + 复制 404.html
├── scripts/copy-404.mjs    # 把 index.html 复制成 404.html（支持直达文章链接）
├── src/
│   ├── main.js             # 挂载 router
│   ├── App.vue             # 整体框架：导航 + <router-view /> + 页脚
│   ├── style.css           # 全局样式（宣纸 + 朱砂配色，含文章排版）
│   ├── router/index.js     # 路由：/ 与 /article/:slug
│   ├── views/
│   │   ├── HomeView.vue    # 首页：Hero + 文章/小工具/Demo 板块
│   │   └── ArticleView.vue # 文章阅读页
│   └── content/
│       ├── articles/*.md   # 文章都放这里
│       └── articles/index.js # 构建时读取并解析所有 md，导出列表
├── public/
│   ├── favicon.svg
│   └── game.html           # 独立小游戏「修狗巨人」，访问 /game.html
└── .github/workflows/deploy.yml   # 自动部署工作流
```

## 部署

- 推送 `master` 分支即自动部署：GitHub Actions 构建 `dist/` 后用 `deploy-pages` 发布。
- 仓库 Pages 的 Source 已设为 **GitHub Actions**（build_type: workflow），**不要改回分支部署**（否则会把源码当静态站、页面空白）。
- `build` 脚本会复制 `dist/index.html` 为 `dist/404.html`，这样用户**直接打开** `/article/xxx` 链接时，GitHub Pages 会把应用交还给 vue-router 渲染，而不是 404。

## 关键约束

- 本地 Node 是 **v18.20.5**；最新 Vite 7 / vue-router 5 需要 Node 20.19+。**升级 Node 之前不要把 Vite 升到 7、vue-router 升到 5。**
- 独立页面（如 game.html）放 `public/`，会原样复制到站点根路径，访问 `/game.html`。
- 文章内容是作者自己写的，Markdown 渲染时关闭了 HTML（`html: false`），不需要消毒库。

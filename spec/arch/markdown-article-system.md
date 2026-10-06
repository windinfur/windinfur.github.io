# Markdown 文章系统技术方案

> 记录日期：2026-10-06
> 适用项目：不可以已 · 个人博客（Vue 3 + Vite 5 + GitHub Pages）
> 目的：沉淀当前 Markdown 文章的「编写 → 构建 → 预览 → 发布」方案，供本项目后续迭代及其他静态站点复用。

## 1. 背景与目标

博客部署在 GitHub Pages 上，是纯静态站点，没有后端、数据库和 CMS，但需要能方便地写技术文章。

设计目标：

- 用 Markdown 写作，不写 HTML
- 发布 = 新增一个 `.md` 文件并推送，不改代码、不做手工登记
- 访客打开文章要快，不需要等待浏览器现解析
- 不引入后端、数据库、在线编辑器
- 保留自定义首页和 Demo（如小游戏）的现有结构

当前版本（v1）明确不做：在线编辑器、评论、全文搜索、草稿箱、代码高亮。这些列在第 11 节「扩展路线」。

## 2. 方案总览

一句话：**文章以 `.md` 文件存放在仓库里，构建时由 Vite 打进产物，运行时由 markdown-it 渲染成 HTML。**

三种可选路线的对比：

| 方案 | 解析时机 | 优点 | 缺点 | 是否采用 |
| --- | --- | --- | --- | --- |
| 构建时解析 | `npm run build` 时 | 访问快、无额外请求、实现简单 | 新增文章需重新构建 | ✅ 采用 |
| 运行时解析 | 访客打开页面时 | 文章可独立更新 | 每篇都要下载 + 解析 | ❌ |
| 现成博客框架 | 框架内置 | 功能全（搜索/目录/RSS） | 需要重构现有站点 | ❌（保留为备选） |

现有首页、Demo 页已经定稿，切换 VitePress / Hexo 这类框架的改造成本高于收益，因此在当前 Vue 工程上做轻量扩展。

## 3. 技术选型

| 依赖 | 版本 | 作用 |
| --- | --- | --- |
| Vue | ^3.5.0 | 页面渲染 |
| vue-router | ^4.6.4 | 首页 / 文章页两条路由 |
| markdown-it | ^15.0.1 | Markdown → HTML |
| Vite | ^5.4.0 | 构建、`import.meta.glob` 读取 md |
| Node | v18.20.5 | 构建环境 |

**版本约束（重要）**：最新 vue-router 5.x 要求 Vite 7 / Node 20+，Vite 7 也要求 Node 20.19+。在升级 Node 之前，必须保持 `vue-router@4` + `vite@5`；若未来升级 Node，再统一评估升级。

## 4. 目录结构与职责

```
├── spec/arch/markdown-article-system.md   # 本文档
├── scripts/copy-404.mjs                   # 构建后把 index.html 复制为 404.html
├── src/
│   ├── main.js                            # 挂载 router
│   ├── App.vue                            # 框架层：导航 + <router-view /> + 页脚
│   ├── router/index.js                    # 路由表：/ 与 /article/:slug
│   ├── views/
│   │   ├── HomeView.vue                   # 首页：Hero + 文章列表 + 小工具 + Demo
│   │   └── ArticleView.vue                # 文章阅读页
│   ├── content/articles/
│   │   ├── index.js                       # 构建时读取并解析所有 md，导出文章数组
│   │   └── *.md                           # 文章本体，一篇一个文件
│   └── style.css                          # 含文章排版样式
└── package.json                           # build = vite build + copy-404
```

## 5. 数据流

### 5.1 构建阶段

```
src/content/articles/*.md
        │  import.meta.glob('./*.md', { eager: true, query: '?raw', import: 'default' })
        ▼
原始 Markdown 字符串
        │  parseFrontmatter()  正则切分 --- 之间的元信息
        ▼
{ meta, content }
        │  拼接 slug（文件名）、补默认值、按 date 倒序
        ▼
articles[]   // 打包进 JS bundle
```

### 5.2 运行阶段

```
首页   /                 → HomeView    → articles[] 渲染文章卡片
文章页 /article/:slug    → ArticleView → getArticleBySlug(slug)
                                      → markdown-it 渲染 content
                                      → v-html 输出正文
```

## 6. 关键实现

### 6.1 文章加载：`import.meta.glob`

```js
const modules = import.meta.glob('./*.md', {
  eager: true,          // 构建时全部读入，不在运行时发请求
  query: '?raw',        // 拿文件原文，而不是当成 JS 模块
  import: 'default',
})
```

要点：

- 路径相对当前文件，`./*.md` 表示同目录下所有 Markdown；
- `eager: true` 意味着所有文章内容都会进入首包，文章量小（几十篇）时完全没问题；
- 文章变多后应改成懒加载（见第 11 节），避免首屏体积膨胀。

### 6.2 Frontmatter 解析

约定文件开头用三条 `---` 包住元信息：

```md
---
title: 文章标题
date: 2026-09-06
tags: [Vue3, 部署]
desc: 首页卡片上显示的简介
---

正文从这里开始。
```

解析逻辑（`src/content/articles/index.js`）用一条正则切出元信息块和正文，再逐行按第一个 `:` 拆分成键值对：

```js
const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/)
```

字段约定：

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | 否 | 文件名 | 文章标题，也用于首页卡片 |
| `date` | 否 | 空字符串 | 必须为 `YYYY-MM-DD`，用于排序 |
| `tags` | 否 | `[]` | 支持 `[a, b]` 或 `a, b` 两种写法 |
| `desc` | 否 | 空字符串 | 首页卡片简介 |

简化点（有意为之，够用就好）：

- 只支持单行 `key: value`，不支持多行值、嵌套 YAML、注释；
- 值两端的引号会被去掉；
- 没有做日期合法性校验，写错格式会直接影响排序；
- 没有 frontmatter 时整篇内容都当正文，不报错。

### 6.3 Slug 规则

文件名即网址 slug：`first-post.md` → `/article/first-post`。

建议文件名使用「英文小写 + 短横线」（如 `vite-github-pages.md`）。中文文件名能用，但生成的链接会被浏览器编码成 `%E4%B8%AD%E6%96%87` 形式，既不好看也不方便分享。

### 6.4 排序

```js
.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
```

按 `date` 字符串倒序排列。因为格式固定为 `YYYY-MM-DD`，字符串比较等价于日期比较。没写日期的文章会排到最后。

### 6.5 Markdown 渲染

```js
const md = new MarkdownIt({ html: false, linkify: true })
const rendered = computed(() => article.value ? md.render(article.value.content) : '')
```

- `html: false`：禁用正文里的原始 HTML，避免注入风险；
- `linkify: true`：纯文本网址自动变成链接；
- 渲染结果通过 `v-html` 输出。内容来自作者本人提交的仓库文件，不是访客输入，因此当前不需要额外 sanitizer；若将来支持外部投稿，必须补上 HTML 清洗。

### 6.6 首页文章列表

`HomeView.vue` 直接引用 `articles`，用 `router-link` 渲染卡片：

```vue
<router-link v-for="post in posts" :key="post.slug" :to="`/article/${post.slug}`" class="card card-link">
  <span class="card-tag">{{ post.tags[0] || '文章' }}</span>
  <h3 class="card-title">{{ post.title }}</h3>
  <p class="card-desc">{{ post.desc }}</p>
  <time v-if="post.date" class="card-date">{{ post.date }}</time>
</router-link>
```

列表不需要手工登记：新增 md 文件后重新构建即自动出现。

### 6.7 文章阅读页

`ArticleView.vue` 从路由参数取 slug，查到文章后用 markdown-it 渲染：

```js
const route = useRoute()
const article = computed(() => getArticleBySlug(String(route.params.slug)))
```

路由切换时 `computed` 会自动重新计算，因此「上一篇/下一篇」这类跳转不需要额外处理。文章不存在时显示「这篇文章不存在或已被移除」。

## 7. 路由与 GitHub Pages 直达链接

### 7.1 路由配置

```js
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/article/:slug', name: 'article', component: ArticleView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
createRouter({ history: createWebHistory(), routes })
```

使用 history 模式（URL 中没有 `#`）。站点部署在用户主页根路径，因此 `vite.config.js` 中 `base: '/'`。

### 7.2 直达链接的 404 问题与兜底

纯静态托管没有服务器 rewrite 规则。用户直接访问 `/article/first-post` 时，GitHub Pages 找不到该路径的文件，会返回 404 页面。

解决方案是在构建后把首页复制一份当作 404 兜底页：

```js
// scripts/copy-404.mjs
copyFileSync('dist/index.html', 'dist/404.html')
```

```json
// package.json
"build": "vite build && node scripts/copy-404.mjs"
```

原理：GitHub Pages 对未知路径返回 `404.html` 的内容，浏览器地址栏仍是 `/article/first-post`，Vue 应用照常启动，vue-router 读到真实路径并渲染对应文章。

已知代价：

- HTTP 状态码仍然是 404（内容正常显示，但搜索引擎和部分工具会视为未找到）；
- 若要拿到 200 状态码，可选方案是改用 hash 路由（`/#/article/xxx`），或迁移到支持 rewrite 的托管（Cloudflare Pages / Netlify / Vercel）。

另外注意：GitHub 仓库 Pages 的 Source 必须保持 **GitHub Actions**，不要改回「分支部署」，否则会把源码目录当成静态站点，页面空白。

## 8. 样式约定

配色沿用宣纸 + 朱砂主题，变量定义在 `src/style.css` 顶部的 `:root`。

| 类名 | 用途 |
| --- | --- |
| `.card` / `.card-link` | 首页卡片与其链接形态 |
| `.card-tag` / `.card-title` / `.card-desc` / `.card-date` | 卡片内部元素 |
| `.section-empty` | 列表为空时的占位文案 |
| `.article-page` | 文章页容器（限宽 720px 居中） |
| `.back-link` | 返回首页链接 |
| `.article-header` | 标题 + 日期 + 标签区域 |
| `.article-meta` / `.article-tags` | 元信息行与标签胶囊 |
| `.article-body` | 正文排版（h2/h3/p/ul/blockquote/code/pre/img） |
| `.article-empty` | 文章不存在提示 |

正文中的代码块、引用、行内代码样式都在 `.article-body` 命名空间下，新增文章不需要额外写样式。

## 9. 写作与发布流程

1. 在 `src/content/articles/` 新建 `<slug>.md`；
2. 顶部写 frontmatter（title / date / tags / desc）；
3. 正文用 Markdown 写；
4. 本地执行 `npm run dev` 预览（改文件即时生效）；
5. 提交并推送 `master`，GitHub Actions 自动构建发布。

写作注意事项：

- `date` 必须是 `YYYY-MM-DD`，否则首页排序会异常；
- 文件名用英文小写短横线，避免链接被编码；
- 文章一旦进入该目录就会发布，当前没有草稿过滤机制。

## 10. 已知限制

| 限制 | 说明 | 影响 |
| --- | --- | --- |
| 文章全量进首包 | `eager: true` | 文章多时首屏变大 |
| 无代码高亮 | 只有等宽字体样式 | 技术文章代码可读性一般 |
| 无目录 / 上下篇 / 标签页 / 搜索 / RSS | v1 未实现 | 需要时再扩展 |
| 直达链接返回 404 状态码 | GitHub Pages 静态托管限制 | 内容正常，SEO 略弱 |
| frontmatter 为简化解析 | 不支持多行 / 嵌套 YAML | 复杂元信息需升级为 gray-matter |
| 无草稿机制 | 目录下所有 md 都会发布 | 草稿需放别处 |

## 11. 扩展路线

按「性价比」从高到低排列：

1. **代码高亮**：markdown-it 配合 highlight.js 或 shiki。highlight.js 体积小、接入快；shiki 效果更好但体积大，建议按需引入语言。
2. **上一篇 / 下一篇**：`articles` 已按日期排序，用当前 slug 的索引取相邻两项即可，无需新增数据源。
3. **标签页**：新增 `/tag/:tag` 路由，复用首页卡片列表组件，按 `tags` 过滤。
4. **目录（TOC）**：用 markdown-it-anchor 给标题加 id，再从渲染结果或 token 流中提取标题树。
5. **客户端搜索**：文章量不大时可用 minisearch 等轻量库，在构建时生成索引。
6. **RSS / sitemap**：在构建后脚本里根据 `articles` 生成 XML，成本低但对读者很有用。
7. **文章懒加载**：把 `eager: true` 改为按需 `import()`，首页只加载元信息，进入文章页再取正文。文章超过几十篇后再做。
8. **草稿机制**：约定 `_` 前缀文件或 `drafts/` 目录，在 glob 结果里过滤掉。
9. **frontmatter 增强**：引入 gray-matter，支持多行值、嵌套结构和更严格的校验。

## 12. 复用到其他项目的步骤

1. 安装依赖（**注意 vue-router 必须锁 4.x**）：

   ```bash
   npm install vue-router@4 markdown-it
   ```

2. 拷贝以下文件并按需改路径：
   - `src/content/articles/index.js`（文章加载与解析）
   - `src/views/ArticleView.vue`（阅读页）
   - `src/views/HomeView.vue` 中的文章列表片段
   - `src/router/index.js`（路由表）
   - `scripts/copy-404.mjs`（静态托管兜底）
   - `src/style.css` 中 `.article-*` / `.card-*` 段落

3. `src/main.js` 中挂载 router：`createApp(App).use(router).mount('#app')`。

4. `vite.config.js` 设置 `base`：
   - 用户主页（`<user>.github.io`）用 `'/'`
   - 项目页（`<user>.github.io/<repo>/`）用 `'/<repo>/'`

5. `package.json` 的 build 脚本改为 `vite build && node scripts/copy-404.mjs`。

6. 托管平台把发布源设为 GitHub Actions（GitHub Pages）或对应构建命令。

7. 验收清单：
   - 新建一篇 md，首页是否出现卡片；
   - 点进文章，Markdown 标题/列表/代码块是否正常；
   - 刷新文章页（直达链接）是否仍能显示；
   - `npm run build` 是否生成 `dist/404.html`。

## 附录 A：文件职责索引

| 文件 | 职责 |
| --- | --- |
| `src/content/articles/*.md` | 文章内容与元信息 |
| `src/content/articles/index.js` | 读取 md、解析 frontmatter、排序、按 slug 查询 |
| `src/router/index.js` | `/` 与 `/article/:slug` 路由定义 |
| `src/views/HomeView.vue` | 首页与文章列表 |
| `src/views/ArticleView.vue` | markdown-it 渲染与文章页布局 |
| `src/App.vue` | 站点框架（导航、页脚、router-view） |
| `scripts/copy-404.mjs` | 生成静态托管的直达链接兜底页 |
| `src/style.css` | 卡片与文章排版样式 |

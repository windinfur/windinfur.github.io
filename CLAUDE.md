# 不可以已 · 个人博客

个人博客「不可以已」（学不可以已）。记录技术、分享自己写的小工具和 Demo。

- 线上地址：https://windinfur.github.io/
- 仓库：windinfur/windinfur.github.io（默认分支 master）

## 技术栈

- Vue 3 + Vite 5（纯 JS，非 TS）
- 纯 CSS，无 UI 框架
- 目前**没有** vue-router / Pinia（功能尚未定，后续按需添加）

## 常用命令

```bash
npm install       # 安装依赖
npm run dev       # 本地开发 http://localhost:5173
npm run build     # 构建到 dist/
npm run preview   # 本地预览构建产物
```

## 目录结构

```
├── index.html            # 入口
├── vite.config.js        # base: '/'（GitHub Pages 用户主页根路径）
├── src/
│   ├── main.js
│   ├── App.vue           # 首页：导航 + Hero + 文章/小工具/Demo 板块
│   └── style.css         # 全局样式（宣纸 + 朱砂配色）
├── public/
│   ├── favicon.svg
│   └── game.html         # 独立小游戏「修狗巨人」，访问 /game.html
└── .github/workflows/deploy.yml   # 自动部署工作流
```

## 部署

- 推送 `master` 分支即自动部署：GitHub Actions 构建 `dist/` 后用 `deploy-pages` 发布。
- 仓库 Pages 的 Source 已设为 **GitHub Actions**（build_type: workflow），**不要改回分支部署**（否则会把源码当静态站、页面空白）。

## 关键约束

- 本地 Node 是 **v18.20.5**；最新 create-vite / Vite 7 需要 Node 20.19+。**升级 Node 之前不要把 Vite 升到 7。**
- 独立页面（如 game.html）放 `public/`，会原样复制到站点根路径，访问 `/game.html`。

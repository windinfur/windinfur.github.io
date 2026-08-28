# 不可以已

学不可以已 —— 一个记录技术、分享工具与 Demo 的个人博客。

## 技术栈

- Vue 3 + Vite 5
- 纯 CSS（无 UI 框架）

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview   # 本地预览构建产物
```

## 部署

通过 GitHub Actions 自动部署到 GitHub Pages（`windinfur.github.io` 的用户主页）。

- 推送 `master` 分支或手动触发 `Deploy to GitHub Pages` 工作流即可发布。
- 需在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**（仅首次配置一次）。
- 站点地址：https://windinfur.github.io/

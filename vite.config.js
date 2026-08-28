import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base 设为 '/'：站点部署在 GitHub Pages 用户主页（windinfur.github.io 的根路径）
export default defineConfig({
  base: '/',
  plugins: [vue()],
})

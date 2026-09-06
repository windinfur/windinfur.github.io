import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('已生成 dist/404.html（用于支持直接打开文章链接）')

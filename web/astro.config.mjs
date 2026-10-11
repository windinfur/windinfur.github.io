import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://windinfur.github.io',
  output: 'static',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: [vue(), sitemap()],
});

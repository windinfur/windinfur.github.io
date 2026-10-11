import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['工具', 'Demo', '软件']),
    status: z.enum(['可玩', '开发中', '计划中']).optional(),
    link: z.string().optional(),
    order: z.number().default(99),
    summary: z.string().optional(),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['可玩', '开发中', '计划中']),
    entry: z.string().optional(),
    order: z.number().default(99),
    summary: z.string().optional(),
  }),
});

export const collections = { articles, works, games };

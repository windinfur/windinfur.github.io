const modules = import.meta.glob('./*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/)
  if (!match) return { meta: {}, content: raw }

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key === 'tags') {
      meta.tags = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else {
      meta[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }

  return { meta, content: raw.slice(match[0].length) }
}

function slugFromPath(path) {
  return path.split(/[\\/]/).pop().replace(/\.md$/, '')
}

export const articles = Object.entries(modules)
  .map(([path, raw]) => {
    const { meta, content } = parseFrontmatter(raw)
    return {
      slug: slugFromPath(path),
      title: meta.title || slugFromPath(path),
      date: meta.date || '',
      desc: meta.desc || '',
      tags: meta.tags || [],
      content,
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug)
}

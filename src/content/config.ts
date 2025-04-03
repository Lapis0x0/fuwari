import { defineCollection, z } from 'astro:content'

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.date(),
    updated: z.date().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    image: z.string().optional().default(''),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().optional().default(''),
    lang: z.string().optional().default(''),
    pinned: z.boolean().optional().default(false),

    /* 文章加密相关字段 */
    encrypted: z.boolean().optional().default(false),
    password: z.string().optional().default(''),

    /* For internal use */
    prevTitle: z.string().default(''),
    prevSlug: z.string().default(''),
    nextTitle: z.string().default(''),
    nextSlug: z.string().default(''),
  }),
})

const specCollection = defineCollection({
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    projects: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
        items: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            image: z.string().optional(),
            url: z.string().optional(),
            categories: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
            posts: z.array(z.string()).optional()
          })
        )
      })
    ).optional()
  }),
})

export const collections = {
  posts: postsCollection,
  spec: specCollection,
}

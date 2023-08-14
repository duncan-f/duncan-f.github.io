import { z, defineCollection } from 'astro:content';
import { dateFormat } from '@/lib/utils';

const postsCollection = defineCollection({
  schema: z.object({
    author: z.object({
      name: z.enum(["Farouk Mokhtari"]),
      email: z.string().email().optional(),
      website: z.string().url().optional(),
      btc: z.string().optional(),
      usdt: z.string().optional(),
      xmr: z.string().optional(),
    }),
    title: z.string().max(
      160,
      "For best SEO results, please provide no more than 160 characters on this field."
    ),
    description: z.string().max(
      160,
      "For best SEO results, please provide no more than 160 characters on this field."
    ),
    category: z.enum(["General", "Writeup", "Tutorial"]),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    date: z.date().transform((str) => dateFormat(str)),
    draft: z.boolean().default(false).optional()
  }),
});

export const collections = {
  'posts': postsCollection,
}


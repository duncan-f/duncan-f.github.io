import { siteData } from '@/lib/config';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function get(context) {
  const posts = await getCollection('posts');
  return rss({
    title: siteData.title,
    description: siteData.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      author: post.data.author.name,
      // Compute RSS link from post `slug`
      // This example assumes all posts are rendered as `/posts/[slug]` routes
      link: `/posts/${post.slug}/`,
    })),
  });
}


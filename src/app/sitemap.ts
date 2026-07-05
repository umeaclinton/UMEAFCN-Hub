import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.umeafcnhub.online';
  
  // 1. Static Routes
  const routes: MetadataRoute.Sitemap = [
    { 
      url: `${baseUrl}`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/blog`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/privacy`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/terms`, 
      lastModified: new Date(), 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
  ];
  
  // 2. Dynamic Job Posts
  try {
    const jobs = await sql`
      SELECT slug, pub_date 
      FROM posts 
      WHERE apply_type != 'none' 
      ORDER BY pub_date DESC 
      LIMIT 10000;
    `;
    
    const jobRoutes = jobs.rows.map((job) => ({
      url: `${baseUrl}/post/${job.slug}`,
      lastModified: new Date(job.pub_date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    
    routes.push(...jobRoutes);
  } catch (error) {
    console.error("Error generating job sitemap URLs", error);
  }
  
  // 3. Dynamic Blog Posts
  try {
    const blogs = await sql`
      SELECT slug, pub_date 
      FROM blog_posts 
      ORDER BY pub_date DESC 
      LIMIT 1000;
    `;
    
    const blogRoutes = blogs.rows.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.pub_date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    
    routes.push(...blogRoutes);
  } catch (error) {
    console.error("Error generating blog sitemap URLs", error);
  }
  
  return routes;
}

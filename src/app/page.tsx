import { getRecentPosts } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0; // Don't cache this page statically

export default async function Home() {
  let posts: any[] = [];
  try {
    posts = await getRecentPosts(20);
  } catch (err) {
    console.error("Error loading posts on homepage:", err);
  }

  return (
    <div className="posts-grid">
      {posts.length > 0 ? (
        posts.map((post: any) => (
          <article key={post.id} className="post-card glass">
            <h2>
              <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
            </h2>
            <div className="post-meta">
              <time>{new Date(post.pub_date).toLocaleString()}</time>
            </div>
            <div className="post-excerpt">
              {/* Extract a snippet from HTML content */}
              {post.content.replace(/<[^>]+>/g, '').substring(0, 150)}...
            </div>
            <Link href={`/post/${post.slug || post.id}`} className="read-more">
              Read More
            </Link>
          </article>
        ))
      ) : (
        <div className="glass no-posts">
          <p>No posts yet. The monitor will fetch new posts soon!</p>
        </div>
      )}
    </div>
  );
}

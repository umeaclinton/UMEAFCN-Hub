import { getRecentPosts, getTotalPostsCount } from '@/lib/db';
import Link from 'next/link';

export const revalidate = 0; // Don't cache this page statically

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.q || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const limit = 12; // Posts per page
  const offset = (currentPage - 1) * limit;

  let posts: any[] = [];
  let totalPosts = 0;
  
  try {
    posts = await getRecentPosts(limit, offset, query);
    totalPosts = await getTotalPostsCount(query);
  } catch (err) {
    console.error("Error loading posts on homepage:", err);
  }

  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <div>
      <form action="/" method="GET" className="search-form">
        <input 
          type="text" 
          name="q" 
          defaultValue={query} 
          placeholder="Search jobs..." 
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post: any) => (
            <article key={post.id} className="post-card">
              <h2>
                <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span className="category-badge">{post.category || 'General'}</span>
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
          <div className="no-posts">
            <p>{query ? `No posts found for "${query}".` : 'No posts yet. The monitor will fetch new posts soon!'}</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-controls">
            <Link 
              href={`/?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} 
              className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
            >
              &larr; Previous
            </Link>
            <Link 
              href={`/?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} 
              className={`page-btn ${currentPage >= totalPages ? 'disabled' : ''}`}
            >
              Next &rarr;
            </Link>
          </div>
          <div className="page-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

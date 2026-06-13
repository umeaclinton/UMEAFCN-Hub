import { getPostById } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Don't statically generate this page so it's always fresh

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    notFound();
  }

  let post;
  try {
    post = await getPostById(id);
  } catch (err) {
    console.error("Error loading post:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <article className="single-post glass">
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time>Published on: {new Date(post.pub_date).toLocaleString()}</time>
          <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="source-link">
            Original Source
          </a>
        </div>
      </header>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="post-footer">
        <Link href="/" className="btn-back">
          &larr; Back to all posts
        </Link>
      </div>
    </article>
  );
}

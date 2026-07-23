import Link from 'next/link';
import { getCategoryImage } from '@/lib/images';
import SafeImage from '@/components/SafeImage';

interface SimilarPostsProps {
  posts: any[];
  type: 'job' | 'blog';
}

export default function SimilarPosts({ posts, type }: SimilarPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="similar-posts-section">
      <h3>Similar {type === 'job' ? 'Opportunities' : 'Articles'}</h3>
      <div className="similar-posts-grid">
        {posts.map(post => {
          const fallbackSeed = post.id;
          const imageCategory = type === 'job' ? post.category : 'blog';
          const linkHref = type === 'job' ? `/post/${post.slug || post.id}` : `/blog/${post.slug}`;
          const plainTextContent = (post.content || post.excerpt || '').replace(/<[^>]+>/g, '').substring(0, 100) + '...';

          return (
            <Link href={linkHref} key={post.id} className="similar-post-card">
              <div className="similar-post-image">
                <SafeImage src={getCategoryImage(imageCategory, post.title, fallbackSeed)} alt={post.title} fallbackSeed={fallbackSeed} />
              </div>
              <div className="similar-post-content">
                {type === 'job' && <span className="similar-category">{post.category || 'General'}</span>}
                <h4>{post.title}</h4>
                <p>{plainTextContent}</p>
                <span className="similar-date">{new Date(post.pub_date).toLocaleDateString()}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

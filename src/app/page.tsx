import { getRecentPosts, getTotalPostsCount, getLatestPostsByCategory, getBlogPosts } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import FilterSidebar from '@/components/FilterSidebar';

export const revalidate = 0; // Don't cache this page statically

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q as string) || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const limit = 12; // Posts per page
  const offset = (currentPage - 1) * limit;

  // Extract filters
  const category = Array.isArray(resolvedSearchParams?.category) ? resolvedSearchParams?.category : (resolvedSearchParams?.category ? [resolvedSearchParams.category as string] : []);
  const jobType = Array.isArray(resolvedSearchParams?.jobType) ? resolvedSearchParams?.jobType : (resolvedSearchParams?.jobType ? [resolvedSearchParams.jobType as string] : []);
  const experience = Array.isArray(resolvedSearchParams?.experience) ? resolvedSearchParams?.experience : (resolvedSearchParams?.experience ? [resolvedSearchParams.experience as string] : []);
  const salary = Array.isArray(resolvedSearchParams?.salary) ? resolvedSearchParams?.salary : (resolvedSearchParams?.salary ? [resolvedSearchParams.salary as string] : []);
  const domain = (resolvedSearchParams?.domain as string) || '';

  const hasFilters = query || category.length > 0 || jobType.length > 0 || experience.length > 0 || salary.length > 0 || domain;

  // Search mode active or Filters active
  if (hasFilters) {
    let posts: any[] = [];
    let totalPosts = 0;
    const filterObj = {
      searchQuery: query,
      category,
      jobType,
      experience,
      salary,
      domain
    };

    try {
      posts = await getRecentPosts(limit, offset, filterObj);
      totalPosts = await getTotalPostsCount(filterObj);
    } catch (err) {
      console.error("Error loading search posts:", err);
    }
    const totalPages = Math.ceil(totalPosts / limit);

    return (
      <div className="filter-page-layout">
        <FilterSidebar />
        
        <div className="filter-results-container">
          <div className="search-header-info">
            <h2>{query ? `Search Results for "${query}"` : "Filtered Job Opportunities"}</h2>
            <Link href="/" className="clear-search-btn">&larr; Back to Home</Link>
          </div>

          <form action="/" method="GET" className="search-form">
            <input 
              type="text" 
              name="q" 
              defaultValue={query} 
              placeholder="Search jobs..." 
              className="search-input"
            />
            {category.map(c => <input type="hidden" name="category" value={c} key={`cat-${c}`}/>)}
            {jobType.map(t => <input type="hidden" name="jobType" value={t} key={`jt-${t}`}/>)}
            {experience.map(e => <input type="hidden" name="experience" value={e} key={`exp-${e}`}/>)}
            {salary.map(s => <input type="hidden" name="salary" value={s} key={`sal-${s}`}/>)}
            {domain && <input type="hidden" name="domain" value={domain} />}
            <button type="submit" className="search-button">Search</button>
          </form>

          <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category || 'General'}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read More
                </Link>
              </article>
            ))
          ) : (
            <div className="no-posts">
              <p>No opportunities found matching "{query}".</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-controls">
              <Link 
                href={`/?page=${currentPage - 1}&q=${query}`} 
                className={`page-btn ${currentPage <= 1 ? 'disabled' : ''}`}
              >
                &larr; Previous
              </Link>
              <Link 
                href={`/?page=${currentPage + 1}&q=${query}`} 
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
      </div>
    );
  }

  // Home Showcase Mode
  let internships: any[] = [];
  let gradPrograms: any[] = [];
  let scholarships: any[] = [];
  let remoteJobs: any[] = [];
  let recentJobs: any[] = [];
  let blogPosts: any[] = [];

  try {
    internships = await getLatestPostsByCategory('Internships', 4);
    gradPrograms = await getLatestPostsByCategory('Graduate Programs', 4);
    scholarships = await getLatestPostsByCategory('Scholarships', 4);
    remoteJobs = await getLatestPostsByCategory('Remote', 4);
    recentJobs = await getLatestPostsByCategory('jobs', 8);
    blogPosts = await getBlogPosts(8, 0); // Query 8 posts to display in 2 rows of 4 columns
  } catch (err) {
    console.error("Error loading showcase items:", err);
  }

  return (
    <div className="home-page-with-sidebar">
      <FilterSidebar />
      <div className="home-showcase">
      {/* Jobfound-style Hero Section */}
      <div className="welcome-section">
        {/* Live badge */}
        <div className="hero-live-badge">
          <span className="hero-live-dot"></span>
          New opportunities added daily
        </div>

        <h1>Find Your Next Career Opportunity</h1>
        <p>Browse curated remote jobs, internships, scholarships, and graduate programs all in one place.</p>

        {/* Social proof */}
        <div className="hero-social-proof">
          <div className="hero-avatars">
            <img src="https://i.pravatar.cc/40?img=1" alt="user" className="hero-avatar" />
            <img src="https://i.pravatar.cc/40?img=5" alt="user" className="hero-avatar" />
            <img src="https://i.pravatar.cc/40?img=9" alt="user" className="hero-avatar" />
            <img src="https://i.pravatar.cc/40?img=12" alt="user" className="hero-avatar" />
            <img src="https://i.pravatar.cc/40?img=17" alt="user" className="hero-avatar" />
          </div>
          <div className="hero-proof-text">
            <div className="hero-stars">★★★★★</div>
            <p>Trusted by <strong>10,000+</strong> professionals across Africa</p>
          </div>
        </div>

        <form action="/" method="GET" className="search-form">
          <input
            type="text"
            name="q"
            placeholder="Search jobs, internships, scholarships..."
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      {/* Newsletter — kept, but no founder note */}
      <div className="newsletter-capture">
        <h4>Join 10,000+ professionals getting our weekly opportunity digest.</h4>
        <form className="newsletter-form" action="/contact">
          <input type="email" placeholder="Enter your email address" required className="newsletter-input" />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
        <div className="newsletter-footer">
          <Link href="/contact">Or click here to Post a Job to our board &rarr;</Link>
        </div>
      </div>

      {/* 1. Career Blog Advice Section (Prioritized at the absolute top) */}
      {blogPosts.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Career Advice & Guides</h2>
            <Link href="/blog" className="see-all-link">Read All Articles &rarr;</Link>
          </div>
          <div className="posts-grid">
            {blogPosts.map((art) => (
              <article key={art.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage('blog', art.title, art.id)} alt={art.title} loading="lazy" fallbackSeed={art.id} />
                </div>
                <h2>
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">Career Guide</span>
                  <time>{new Date(art.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {art.excerpt}
                </div>
                <Link href={`/blog/${art.slug}`} className="read-more">
                  Read Article
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. Graduate Programs Section */}
      {gradPrograms.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Graduate Trainee Programs</h2>
            <Link href="/?q=Graduate" className="see-all-link">See All Graduate Programs &rarr;</Link>
          </div>
          <div className="posts-grid">
            {gradPrograms.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3. Internships Section */}
      {internships.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Latest Internships</h2>
            <Link href="/?q=Internship" className="see-all-link">See All Internships &rarr;</Link>
          </div>
          <div className="posts-grid">
            {internships.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Big Middle CTA Card */}
      <div className="middle-cta-card">
        <h2>Accelerate Your Career Today</h2>
        <p>Get notified about bootcamps, fully-funded international scholarships, and early graduate opportunities direct from verified sources.</p>
        <div className="cta-actions">
          <a href="https://t.me/umeafcnhub" target="_blank" rel="noopener noreferrer" className="cta-btn primary">
            Join Telegram Channel
          </a>
          <Link href="/blog" className="cta-btn secondary">
            Read Career Advice
          </Link>
        </div>
      </div>

      {/* 4. Scholarships Section */}
      {scholarships.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Scholarships & Bootcamps</h2>
            <Link href="/?q=Scholarship" className="see-all-link">See All Scholarships &rarr;</Link>
          </div>
          <div className="posts-grid">
            {scholarships.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 4.5. Remote Jobs Section */}
      {remoteJobs.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Remote Jobs</h2>
            <Link href="/?q=Remote" className="see-all-link">See All Remote Jobs &rarr;</Link>
          </div>
          <div className="posts-grid">
            {remoteJobs.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. Latest Job Openings Section */}
      {recentJobs.length > 0 && (
        <section className="showcase-section">
          <div className="section-header">
            <h2>Recent Job Openings</h2>
            <Link href="/?q=job" className="see-all-link">Browse All Jobs &rarr;</Link>
          </div>
          <div className="posts-grid">
            {recentJobs.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-image">
                  <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} loading="lazy" fallbackSeed={post.id} />
                </div>
                <h2>
                  <Link href={`/post/${post.slug || post.id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="category-badge">{post.category}</span>
                  <time>{new Date(post.pub_date).toLocaleDateString()}</time>
                </div>
                <div className="post-excerpt">
                  {post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 110)}...
                </div>
                <Link href={`/post/${post.slug || post.id}`} className="read-more">
                  Read Details
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
      </div>
    </div>
  );
}

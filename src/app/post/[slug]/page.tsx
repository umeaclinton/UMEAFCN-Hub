import { getPostBySlug, getPostById, getSimilarPosts } from '@/lib/db';
import { getCategoryImage } from '@/lib/images';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ShareButtons from '@/components/ShareButtons';
import SimilarPosts from '@/components/SimilarPosts';

import type { Metadata } from 'next';

export const revalidate = 86400; // Cache for 24 hours — job posts rarely change


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  
  let post = null;
  try {
    post = await getPostBySlug(identifier);
    if (!post && !isNaN(parseInt(identifier, 10))) {
      post = await getPostById(parseInt(identifier, 10));
    }
  } catch (err) {}

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested job post could not be found.',
    };
  }

  // Generate a short description from the HTML content for SEO
  const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...';

  return {
    title: `${post.title} | UMEAFCN Hub`,
    description: plainTextContent,
    openGraph: {
      title: post.title,
      description: plainTextContent,
      type: 'article',
      publishedTime: new Date(post.pub_date).toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: plainTextContent,
    },
  };
}

function generateJobSchema(post: any) {
  // Try to extract company from "Title at Company"
  let companyName = "Partner Company";
  const atMatch = post.title.match(/(?:\s+at\s+|\s+@\s+)(.+)$/i);
  if (atMatch && atMatch[1]) {
    companyName = atMatch[1].trim();
  }

  // Map Category to EmploymentType
  let employmentType = "FULL_TIME";
  const cat = (post.category || "").toLowerCase();
  if (cat.includes("intern")) employmentType = "INTERN";
  else if (cat.includes("contract")) employmentType = "CONTRACTOR";
  else if (cat.includes("part time") || cat.includes("part-time")) employmentType = "PART_TIME";

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": post.title,
    "description": post.content || "No description provided.",
    "datePosted": new Date(post.pub_date).toISOString(),
    "employmentType": employmentType,
    "hiringOrganization": {
      "@type": "Organization",
      "name": companyName,
      "sameAs": "https://umeafcnhub.com"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NG"
      }
    }
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params object in Next.js 15
  const resolvedParams = await params;
  const identifier = resolvedParams.slug;
  
  let post = null;
  try {
    // Try to load by slug first
    post = await getPostBySlug(identifier);
    
    // Fallback for older posts that only have IDs
    if (!post && !isNaN(parseInt(identifier, 10))) {
      post = await getPostById(parseInt(identifier, 10));
    }
  } catch (err) {
    console.error("Error loading post:", err);
  }

  if (!post) {
    notFound();
  }

  const jsonLd = generateJobSchema(post);
  const similarPosts = await getSimilarPosts(post.category || null, post.id, 10);

  return (
    <article className="single-post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="post-featured-banner">
        <SafeImage src={getCategoryImage(post.category, post.title, post.id)} alt={post.title} fallbackSeed={post.id} />
      </div>
      <header className="post-header">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="category-badge">{post.category || 'General'}</span>
          <time>Published on: {new Date(post.pub_date).toLocaleString()}</time>
        </div>
        <ShareButtons title={post.title} />
      </header>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="middle-cta-card" style={{ marginTop: '32px', marginBottom: '32px', padding: '24px', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1.2rem' }}>Never Miss an Opportunity</h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Follow our LinkedIn company page for the latest job postings and career tips.</p>
        <a href="https://www.linkedin.com/company/umeafcnhub" target="_blank" rel="noopener noreferrer" className="cta-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#0077b5', color: 'white', border: 'none' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Follow on LinkedIn
        </a>
      </div>
      
      <div className="post-footer">
        {post.apply_type === 'email' && post.apply_link && (
          <a href={`mailto:${post.apply_link}`} className="apply-btn">
            Apply via Email
          </a>
        )}
        {post.apply_type === 'url' && post.apply_link && (
          <a href={post.apply_link} target="_blank" rel="noopener noreferrer" className="apply-btn">
            Apply Now
          </a>
        )}
        {(post.apply_type === 'email' || post.apply_type === 'url') && post.apply_link && (
          <><br/><br/></>
        )}
        <Link href="/" className="btn-back">
          &larr; Back to all posts
        </Link>
      </div>

      <SimilarPosts posts={similarPosts} type="job" />
    </article>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | UMEAFCN Hub',
  description: 'Learn about UMEAFCN Hub, our job aggregation platform, verification process, and career resources.',
};

export default function AboutPage() {
  return (
    <article className="single-post">
      <header className="post-header">
        <h1>About Us</h1>
        <div className="post-meta">
          <span className="category-badge">Company</span>
          <span>Since 2026</span>
        </div>
      </header>

      <div className="post-content">
        <p>
          Welcome to <strong>UMEAFCN Hub</strong>, your premier online destination for discovering verified, high-quality career opportunities. We compile internships, graduate trainee programs, scholarships, bootcamps, and full-time job roles into a single, clean, accessible platform.
        </p>

        <h2>Meet the Founder</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <img
            src="/ceo&founderimgage.jpg"
            alt="Michael Udochukwu Odoemenam"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #b8962e', flexShrink: 0 }}
          />
          <div>
            <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '0.25rem' }}>Michael Udochukwu Odoemenam</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem' }}>Founder & CEO, UMEAFCN Hub</span>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Michael built UMEAFCN Hub out of a passion for making career opportunities more accessible to young Africans. His vision is a single, trusted platform where every serious job seeker can find their next big break without the noise.
            </p>
            <div style={{ marginTop: '0.75rem' }}>
              <a href="https://www.linkedin.com/in/umeaclinton/" target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', fontWeight: '600', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>

        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to make opportunity discoverable. We know that finding career listings can be tedious and stressful, with openings scattered across dozens of individual job boards and corporate websites. We solve this by consolidating and cleaning data, offering job-seekers a single source of truth for their application journey.
        </p>

        <h2>Our Curation Process</h2>
        <p>
          We believe job-seekers deserve high-quality, easy-to-read, and accessible career information. Our dedicated platform focuses on bringing you the best opportunities through a strict curation process:
        </p>
        <ul>
          <li><strong>Expert Summaries:</strong> We review and summarize lengthy job descriptions, removing confusing corporate jargon to give you a clean, highly readable overview of the role.</li>
          <li><strong>Verified Direct Links:</strong> We do the heavy lifting to find the direct corporate career portal links or official hiring emails, ensuring you never get stuck in confusing redirect loops.</li>
          <li><strong>Quality Control:</strong> We prioritize posts that offer direct application routes, actively avoiding third-party boards that require unnecessary registrations or hidden fees.</li>
        </ul>

        <h2>Google AdSense &amp; Transparency</h2>
        <p>
          We believe in transparency. In order to keep our resources free to job-seekers worldwide, we partner with advertisers like Google AdSense to serve targeted, contextual advertisements. We also host a <strong>Career Blog</strong> packed with original, expert career guidance, CV writing advice, and interview checklists to support your path to success.
        </p>

        <h2>Verified Integrity</h2>
        <p>
          UMEAFCN Hub is an independent aggregator. While we run checks to ensure that the listings, emails, and links we publish are active and authentic, we recommend that all candidates research hiring companies independently before submitting sensitive personal information. We never charge users for job listings or access.
        </p>
      </div>

      <div className="post-footer">
        <Link href="/" className="btn-back">
          &larr; Back to Home
        </Link>
      </div>
    </article>
  );
}

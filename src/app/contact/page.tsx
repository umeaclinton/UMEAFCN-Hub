import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | UMEAFCN Hub',
  description: 'Reach out to UMEAFCN Hub for advertising inquiries, feedback, or support regarding job opportunities.',
};

export default function ContactPage() {
  return (
    <article className="single-post">
      <header className="post-header">
        <h1>Contact Us</h1>
        <div className="post-meta">
          <span className="category-badge">Support</span>
          <span>Get in Touch</span>
        </div>
      </header>

      <div className="post-content">
        <p>
          We would love to hear from you! Whether you have feedback on the portal, inquiries regarding business advertising opportunities, or want to report a listing, please reach out to us using the details below.
        </p>

        <h2>Leadership Team</h2>
        
        {/* Michael - Founder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <img
            src="/ceo&founderimgage.jpg"
            alt="Michael Udochukwu Odoemenam"
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #b8962e', flexShrink: 0 }}
          />
          <div>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>Michael Udochukwu Odoemenam</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>Founder & CEO, UMEAFCN Hub</span>
            <a href="mailto:info@umeafcnhub.online" style={{ fontSize: '0.9rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginBottom: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/></svg>
              info@umeafcnhub.online
            </a>
            <div style={{ marginTop: '0.5rem' }}>
              <a href="https://www.linkedin.com/in/umeaclinton/" target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Frank - MD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <img
            src="/FrankNwoyemaChidera.jpg"
            alt="Frank Nwoyema Chidera"
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1e293b', flexShrink: 0 }}
          />
          <div>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.25rem' }}>Frank Nwoyema Chidera</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.4rem' }}>Managing Director, UMEAFCN Hub</span>
          </div>
        </div>

        <h2>Support &amp; General Inquiries</h2>
        <p>
          For general questions, user support, or suggestions, send an email to:
          <br />
          <strong>Email:</strong> <a href="mailto:info@umeafcnhub.online">info@umeafcnhub.online</a>
        </p>

        <h2>For Employers &amp; Recruiters</h2>
        <p>
          If you are an employer, recruiting team, or HR manager and would like to list open roles, scholarships, or internship opportunities on our board, please contact our listings team:
          <br />
          <strong>Recruitment Inquiries:</strong> <a href="mailto:partners@umeafcnhub.online">partners@umeafcnhub.online</a>
        </p>

        <h2>Report a Job Listing</h2>
        <p>
          We strive to maintain high-integrity listings. If you discover a listing containing outdated info, misleading links, or suspect a scam, please report it immediately:
          <br />
          <strong>Email:</strong> <a href="mailto:reports@umeafcnhub.online">reports@umeafcnhub.online</a>
          <br />
          <em>Please include the post title and the URL slug in your report so we can investigate and remove it quickly.</em>
        </p>

        <h2>Social Communities</h2>
        <p>
          Stay updated on the go and connect with us in our communities:
        </p>
        <ul>
          <li><strong>Telegram Channel:</strong> <a href="https://t.me/umeafcnhub" target="_blank" rel="noopener noreferrer">Join Channel</a></li>
          <li><strong>Twitter (X):</strong> <a href="https://x.com/jobswithclinton" target="_blank" rel="noopener noreferrer">@jobswithclinton</a></li>
        </ul>
      </div>

      <div className="post-footer">
        <Link href="/" className="btn-back">
          &larr; Back to Home
        </Link>
      </div>
    </article>
  );
}

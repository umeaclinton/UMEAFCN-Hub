import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Jobs With Clinton',
  description: 'Reach out to Jobs With Clinton for advertising inquiries, feedback, or support regarding job opportunities.',
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

        <h2>Support & General Inquiries</h2>
        <p>
          For general questions, user support, or suggestions, send an email to:
          <br />
          <strong>Email:</strong> <a href="mailto:info@jobswithclinton.com">info@jobswithclinton.com</a>
        </p>

        <h2>For Employers & Recruiters</h2>
        <p>
          If you are an employer, recruiting team, or HR manager and would like to list open roles, scholarships, or internship opportunities on our board, please contact our listings team:
          <br />
          <strong>Recruitment Inquiries:</strong> <a href="mailto:partners@jobswithclinton.com">partners@jobswithclinton.com</a>
        </p>

        <h2>Report a Job Listing</h2>
        <p>
          We strive to maintain high-integrity listings. If you discover a listing containing outdated info, misleading links, or suspect a scam, please report it immediately:
          <br />
          <strong>Email:</strong> <a href="mailto:reports@jobswithclinton.com">reports@jobswithclinton.com</a>
          <br />
          <em>Please include the post title and the URL slug in your report so we can investigate and remove it quickly.</em>
        </p>

        <h2>Social Communities</h2>
        <p>
          Stay updated on the go and connect with us in our communities:
        </p>
        <ul>
          <li><strong>WhatsApp Channel:</strong> <a href="https://whatsapp.com/channel/0029Va9uQXIAYlUP7x3kDQ2T" target="_blank" rel="noopener noreferrer">Join Channel</a></li>
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

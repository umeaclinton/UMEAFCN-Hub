import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | UMEAFCN Hub',
  description: 'Learn about UMEAFCN Hub, our automated job aggregation platform, verification process, and career resources.',
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

        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to make opportunity discoverable. We know that finding career listings can be tedious and stressful, with openings scattered across dozens of individual job boards and corporate websites. We solve this by consolidating and cleaning data, offering job-seekers a single source of truth for their application journey.
        </p>

        <h2>How It Works</h2>
        <p>
          We use state-of-the-art parsing technologies to scan public RSS feeds, reputable job directories, and recruitment portals. Our system:
        </p>
        <ul>
          <li><strong>Cleans & Paraphrases Listings:</strong> Removes conversational filler and formatting junk to give you a clean, highly readable summary of the role.</li>
          <li><strong>Extracts Verified Applications:</strong> Discovers direct corporate career portal links or official hiring emails, bypassing confusing redirect links.</li>
          <li><strong>Filters Portal Logins:</strong> Automatically hides or flags posts that require registration/accounts on external third-party listing boards. We focus on direct applications.</li>
        </ul>

        <h2>Google AdSense & Transparency</h2>
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

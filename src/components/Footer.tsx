import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section about">
            <h3>
              <img src="/logo-light.jpg" alt="UMEAFCN Hub" className="logo-light" style={{ maxHeight: '40px' }} />
              <img src="/logo-dark.jpg" alt="UMEAFCN Hub" className="logo-dark" style={{ maxHeight: '40px' }} />
            </h3>
            <p>
              Your premium career platform for discovering expertly curated job listings, exclusive opportunities, and professional career advice.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Career Blog</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Social Communities */}
          <div className="footer-section categories">
            <h4>Join Our Community</h4>
            <ul>
              <li><a href="https://t.me/umeafcnhub" target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
              <li><a href="https://x.com/jobswithclinton" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
            </ul>
          </div>

          {/* Founder */}
          <div className="footer-section">
            <h4>Built By</h4>
            <div className="footer-founder">
              <img src="/ceo&founderimgage.jpg" alt="Michael Udochukwu Odoemenam" className="footer-founder-img" />
              <div>
                <p className="footer-founder-name">Michael Udochukwu Odoemenam</p>
                <p className="footer-founder-title">Founder &amp; CEO, UMEAFCN Hub</p>
                <a
                  href="https://www.linkedin.com/in/umeaclinton/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-founder-linkedin"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UMEAFCN Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

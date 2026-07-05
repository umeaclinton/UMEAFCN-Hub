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
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} UMEAFCN Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section about">
            <h3>Jobs With Clinton</h3>
            <p>
              Your premium, automated portal for discovering real-time job listings, parsed and expanded with state-of-the-art AI technology.
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
              <li><a href="https://whatsapp.com/channel/0029Va9uQXIAYlUP7x3kDQ2T" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a></li>
              <li><a href="https://t.me/jobswithclinton" target="_blank" rel="noopener noreferrer">Telegram Channel</a></li>
              <li><a href="https://x.com/jobswithclinton" target="_blank" rel="noopener noreferrer">Twitter (X)</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Jobs With Clinton. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

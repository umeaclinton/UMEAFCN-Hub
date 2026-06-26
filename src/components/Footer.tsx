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
              <li><Link href="/?q=intern">Internships</Link></li>
              <li><Link href="/?q=manager">Managerial Roles</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-section categories">
            <h4>Job Categories</h4>
            <ul>
              <li><Link href="/?q=tech">Technology</Link></li>
              <li><Link href="/?q=finance">Finance</Link></li>
              <li><Link href="/?q=engineering">Engineering & Operations</Link></li>
              <li><Link href="/?q=marketing">Marketing & Sales</Link></li>
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

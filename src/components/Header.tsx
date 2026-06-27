"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container container">
        <div className="logo">
          <Link href="/">Jobs With Clinton</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>

        {/* Hamburger Menu Button */}
        <button 
          className={`burger-btn ${isMenuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
          <span className="burger-bar"></span>
        </button>

        {/* Mobile Navigation Dropdown */}
        <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/blog" onClick={closeMenu}>Blog</Link>
          <Link href="/about" onClick={closeMenu}>About Us</Link>
          <Link href="/contact" onClick={closeMenu}>Contact Us</Link>
          <Link href="/terms" onClick={closeMenu}>Terms & Conditions</Link>
          <Link href="/privacy" onClick={closeMenu}>Privacy Policy</Link>
        </nav>

        {/* Backdrop for mobile menu */}
        {isMenuOpen && <div className="menu-backdrop" onClick={closeMenu}></div>}
      </div>
    </header>
  );
}

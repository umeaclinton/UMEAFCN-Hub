"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
  };

  const toggleCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  return (
    <header className="site-header">
      <div className="header-container container">
        <div className="logo">
          <Link href="/">
            <img src="/logo-light.jpg" alt="UMEAFCN Hub" className="logo-light" />
            <img src="/logo-dark.jpg" alt="UMEAFCN Hub" className="logo-dark" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link href="/">Home</Link>
          <div className="nav-dropdown">
            <span className="nav-dropdown-toggle">Categories ▾</span>
            <div className="nav-dropdown-menu">
              <Link href="/?q=Scholarship">Scholarships</Link>
              <Link href="/?q=Internship">Internships</Link>
              <Link href="/?q=Graduate">Graduate Trainee</Link>
              <Link href="/blog">Career Advice</Link>
            </div>
          </div>
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
          <div className="mobile-dropdown">
            <button className="mobile-dropdown-toggle" onClick={toggleCategories}>
              Categories {isCategoriesOpen ? '▴' : '▾'}
            </button>
            <div className={`mobile-dropdown-menu ${isCategoriesOpen ? 'open' : ''}`}>
              <Link href="/?q=Scholarship" onClick={closeMenu}>Scholarships</Link>
              <Link href="/?q=Internship" onClick={closeMenu}>Internships</Link>
              <Link href="/?q=Graduate" onClick={closeMenu}>Graduate Trainee</Link>
              <Link href="/blog" onClick={closeMenu}>Career Advice</Link>
            </div>
          </div>
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

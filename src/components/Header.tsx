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
          <Link href="/?q=tech">Tech</Link>
          <Link href="/?q=finance">Finance</Link>
          <Link href="/?q=engineering">Engineering</Link>
          <Link href="/?q=marketing">Marketing</Link>
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
          <Link href="/?q=tech" onClick={closeMenu}>Tech Jobs</Link>
          <Link href="/?q=finance" onClick={closeMenu}>Finance Jobs</Link>
          <Link href="/?q=engineering" onClick={closeMenu}>Engineering Jobs</Link>
          <Link href="/?q=marketing" onClick={closeMenu}>Marketing Jobs</Link>
        </nav>

        {/* Backdrop for mobile menu */}
        {isMenuOpen && <div className="menu-backdrop" onClick={closeMenu}></div>}
      </div>
    </header>
  );
}

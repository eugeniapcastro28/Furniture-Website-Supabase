import React, { useState, useEffect, useRef } from 'react';
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.png';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#categories', label: 'Categories' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

const TopBar = () => {
  const [activeLink, setActiveLink] = useState('#home');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1050);
      if (window.innerWidth > 1050) setIsMenuOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const scrollTarget = document.querySelector('[data-scroll-container]') || document.documentElement;
    const getScrollY = () =>
      scrollTarget === document.documentElement ? window.scrollY : scrollTarget.scrollTop;

    const handleScroll = () => setIsScrolled(getScrollY() > 40);
    const target = scrollTarget === document.documentElement ? window : scrollTarget;
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLinkClick = (href) => {
    setActiveLink(href);
    setIsMenuOpen(false);
  };

  return (
    <header ref={menuRef} className={`${styles.topBarContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src={isMobile ? mobileLogo : logo} alt="E. Panganiban" />
          <span className={styles.logoName}>E. Panganiban Bamboo & Furniture Shop</span>
        </div>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ''}`}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`${styles.navItem} ${activeLink === href ? styles.active : ''}`}
              onClick={() => handleLinkClick(href)}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className={styles.menuIcon}
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
};

export default TopBar;

import React, { useState, useEffect, useRef } from 'react';
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.webp';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const navLinks = [
  { href: '#home', label: 'Home', page: 'home' },
  { href: '#products', label: 'Products', page: 'products' },
  { href: '#categories', label: 'Categories', page: 'home' },
  { href: '#about', label: 'About', page: 'home' },
  { href: '#contact', label: 'Contact', page: 'home' },
];

const TopBar = ({ currentPage = 'home', onNavigate, onClearProduct }) => {
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

  // Intersection Observer for dynamic active link highlighting based on scroll
  useEffect(() => {
    if (currentPage !== 'home') return undefined;

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = `#${entry.target.id}`;
          setActiveLink(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
      if (navLinks.some((link) => link.href === `#${section.id}`)) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'products') {
      setActiveLink('#products');
    } else if (currentPage === 'home') {
      setActiveLink('#home');
    }
  }, [currentPage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLinkClick = (href, page, event) => {
    event.preventDefault();
    setIsMenuOpen(false);

    // CRITICAL FIX: Clear out the open product details overlay 
    // to unblock the main layout viewport canvas.
    if (onClearProduct) {
      onClearProduct();
    }

    if (page === 'products') {
      onNavigate?.('products');
      setActiveLink('#products');
      return;
    }

    onNavigate?.('home');
    setActiveLink(href);

    setTimeout(() => {
      const targetSection = document.querySelector(href);
      targetSection?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header ref={menuRef} className={`${styles.topBarContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src={isMobile ? mobileLogo : logo} alt="E. Panganiban" />
          <span className={styles.logoName}>E. Panganiban Bamboo & Furniture Shop</span>
        </div>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ''}`}>
          {navLinks.map(({ href, label, page }) => (
            <a
              key={href}
              href={href}
              className={`${styles.navItem} ${activeLink === href ? styles.active : ''}`}
              onClick={(event) => handleLinkClick(href, page, event)}
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
import React, { useState, useEffect, useRef } from 'react';
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.webp';
import { HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';

const navLinks = [
  { href: '#home', label: 'Home', page: 'home' },
  { 
    href: '#products', 
    label: 'Products', 
    page: 'products',
    dropdown: [
      { href: '#products', label: 'All Products', page: 'products' }, 
      { href: '#products', label: 'Our Collections', page: 'home' }  
    ]
  },
  { href: '#categories', label: 'Categories', page: 'home' },
  { href: '#about', label: 'About', page: 'home' },
  { href: '#contact', label: 'Contact', page: 'home' },
];

const waitForElement = (selector, { timeout = 1500, interval = 30 } = {}) => {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      const el = document.querySelector(selector);
      if (el) { resolve(el); return; }
      if (performance.now() - start >= timeout) { resolve(null); return; }
      requestAnimationFrame(() => setTimeout(tick, interval));
    };
    tick();
  });
};

const TopBar = ({ currentPage = 'home', selectedCategory = 'all', onNavigate, onClearProduct }) => {
  const [activeLink, setActiveLink] = useState('#home');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const menuRef = useRef(null);
  const pendingScrollRef = useRef(null);

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
    const header = menuRef.current;
    if (!header) return;
    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    };
    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(header);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentPage !== 'home') return undefined;
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          document.getElementById('products-page') === null &&
          !pendingScrollRef.current
        ) {
          setActiveLink(`#${entry.target.id}`);
        }
      });
    };
    let observer = null;
    const timeoutId = setTimeout(() => {
      if (document.getElementById('products-page')) return;
      observer = new IntersectionObserver(observerCallback, observerOptions);
      const sections = document.querySelectorAll('#home, #products, #categories, #about, #contact');
      sections.forEach((section) => observer.observe(section));
    }, 150);
    return () => {
      clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 'products') {
      if (selectedCategory && selectedCategory !== 'all') {
        setActiveLink(`#${selectedCategory}`);
      } else {
        setActiveLink('#products');
      }
    } else if (currentPage === 'home') {
      if (!pendingScrollRef.current) setActiveLink('#home');
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLinkClick = async (href, page, event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);

    if (onClearProduct) onClearProduct();

    if (page === 'products') {
      pendingScrollRef.current = null;
      onNavigate?.('products');
      setActiveLink('#products');
      return;
    }

    const scrollToken = Symbol(href);
    pendingScrollRef.current = scrollToken;
    const isCrossPageLeap = currentPage !== 'home';

    onNavigate?.('home');
    setActiveLink(href);

    const targetSelector = href.startsWith('#') ? href : `#${href}`;
    const targetSection = await waitForElement(targetSelector, { timeout: 1500, interval: 30 });

    if (pendingScrollRef.current !== scrollToken) return;

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (isCrossPageLeap) {
        let checkCount = 0;
        const layoutInterval = setInterval(() => {
          checkCount++;
          if (pendingScrollRef.current === scrollToken && targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (checkCount >= 5) clearInterval(layoutInterval);
        }, 250);
      }
    }

    setTimeout(() => {
      if (pendingScrollRef.current === scrollToken) pendingScrollRef.current = null;
    }, isCrossPageLeap ? 1500 : 500);
  };

  return (
    <header ref={menuRef} className={`${styles.topBarContainer} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <img src={isMobile ? mobileLogo : logo} alt="E. Panganiban" />
          <span className={styles.logoName}>E. Panganiban Bamboo & Furniture Shop</span>
        </div>

        <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ''}`}>
          {navLinks.map((link) => {
            const hasDropdown = !!link.dropdown;
            return (
              <div
                key={link.href}
                className={styles.navItemWrapper}
                onMouseEnter={() => !isMobile && hasDropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => !isMobile && setOpenDropdown(null)}
              >
                <a
                  href={link.href}
                  className={`${styles.navItem} ${activeLink === link.href ? styles.active : ''} ${hasDropdown ? styles.hasDropdown : ''}`}
                  onClick={(event) => {
                    if (isMobile && hasDropdown) {
                      event.preventDefault();
                      setOpenMobileDropdown(prev => prev === link.label ? null : link.label);
                    } else {
                      handleLinkClick(link.href, link.page, event);
                    }
                  }}
                >
                  {link.label}
                  {hasDropdown && (
                    <HiChevronDown
                      className={`${styles.chevronIcon} ${isMobile && openMobileDropdown === link.label ? styles.chevronOpen : ''}`}
                    />
                  )}
                </a>

                {hasDropdown && (
                  (!isMobile && openDropdown === link.label) ||
                  (isMobile && openMobileDropdown === link.label)
                ) && (
                  <div className={`${styles.dropdownMenu} ${isMobile ? styles.mobileDropdown : ''}`}>
                    {link.dropdown.map((subLink, subIdx) => (
                      <a
                        key={`${subLink.href}-${subIdx}`}
                        href={subLink.href}
                        className={styles.dropdownItem}
                        onClick={(event) => handleLinkClick(subLink.href, subLink.page, event)}
                      >
                        {subLink.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          className={styles.menuIcon}
          onClick={() => {
            setIsMenuOpen(v => !v);
            setOpenMobileDropdown(null);
          }}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
import React, { useState, useEffect, useRef } from 'react';
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.webp';
import { HiMenuAlt3, HiX, HiChevronDown } from 'react-icons/hi';

// 1. Restructured navLinks configuration to support sub-dropdown links
const navLinks = [
  { href: '#home', label: 'Home', page: 'home' },
  { 
    href: '#products', 
    label: 'Products', 
    page: 'products',
    dropdown: [
      // 1. All Products -> Goes to the full independent ProductsPage view
      { href: '#products', label: 'All Products', page: 'products' }, 
      // 2. Our Collections -> Stays/Goes to HomePage and scrolls to ProductsSection
      { href: '#products', label: 'Our Collections', page: 'home' }  
    ]
  },
  { href: '#categories', label: 'Categories', page: 'home' },
  { href: '#about', label: 'About', page: 'home' },
  { href: '#contact', label: 'Contact', page: 'home' },
];

// Polls for an element to exist in the DOM (and be laid out) before resolving.
// This replaces the old fixed setTimeout(50) guess, which raced against
// HomePage actually mounting/unmounting its sections when navigating
// from the Products page back to Home.
const waitForElement = (selector, { timeout = 1500, interval = 30 } = {}) => {
  return new Promise((resolve) => {
    const start = performance.now();

    const tick = () => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }
      if (performance.now() - start >= timeout) {
        resolve(null); // give up gracefully, don't throw
        return;
      }
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
  const [openDropdown, setOpenDropdown] = useState(null); // Track hovered item on desktop
  const menuRef = useRef(null);
  const pendingScrollRef = useRef(null); // Tracks an in-flight scroll request so stale ones can be ignored

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
  const handleScroll = () => {
    // If the browser scrolls down more than 40px, trigger the navbar styling shift
    setIsScrolled(window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Replace your Intersection Observer useEffect block with this exact setup:
useEffect(() => {
  if (currentPage !== 'home') return undefined;

  // FIX: Explicitly target the root browser viewport screen
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
        const sectionId = `#${entry.target.id}`;
        setActiveLink(sectionId);
      }
    });
  };

  let observer = null;

  const timeoutId = setTimeout(() => {
    if (document.getElementById('products-page')) return;

    observer = new IntersectionObserver(observerCallback, observerOptions);
    
    const sections = document.querySelectorAll('#home, #products, #categories, #about, #contact');
    sections.forEach((section) => {
      observer.observe(section);
    });
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
      if (!pendingScrollRef.current) {
        setActiveLink('#home');
      }
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

    // Clear product modal popups if navigating away
    if (onClearProduct) {
      onClearProduct();
    }

    // Case A: User selected "All Products" (page is explicitly set to 'products')
    if (page === 'products') {
      pendingScrollRef.current = null; // no scroll needed, we're switching the whole page view
      onNavigate?.('products');
      setActiveLink('#products');
      return;
    }

    // Case B: User selected "Our Collections", "Categories", or other home anchors
    const scrollToken = Symbol(href);
    pendingScrollRef.current = scrollToken;

    // Track if we are leaping across different pages
    const isCrossPageLeap = currentPage !== 'home';

    onNavigate?.('home');
    setActiveLink(href);

    const targetSelector = href.startsWith('#') ? href : `#${href}`;
    const targetSection = await waitForElement(targetSelector, { timeout: 1500, interval: 30 });

    if (pendingScrollRef.current !== scrollToken) return;

    if (targetSection) {
      // 1. Initial scroll to target location
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // 2. Layout Shift Protection Loop:
      // If we jumped from another page, follow up on layout shifts caused by 
      // incoming Supabase requests expanding sections above us.
      if (isCrossPageLeap) {
        let checkCount = 0;
        const layoutInterval = setInterval(() => {
          checkCount++;
          if (pendingScrollRef.current === scrollToken && targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          if (checkCount >= 5) clearInterval(layoutInterval);
        }, 250); // Re-align smoothly over 1.25 seconds as data resolves
      }
    }

    // 3. Dynamic Protection Window:
    // Keep the IntersectionObserver locked out longer for cross-page navigation
    // to give smooth scroll and data rendering time to finalize layout boundaries.
    setTimeout(() => {
      if (pendingScrollRef.current === scrollToken) {
        pendingScrollRef.current = null;
      }
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
                  onClick={(event) => handleLinkClick(link.href, link.page, event)}
                >
                  {link.label}
                  {hasDropdown && <HiChevronDown className={styles.chevronIcon} />}
                </a>

                {/* Dropdown Menu Overlay Canvas Layer */}
                {hasDropdown && (openDropdown === link.label || isMobile) && (
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
import React, { useState, useEffect } from 'react'; // Added useEffect
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.png'; // Import your mobile logo
import { HiMenuAlt3 } from "react-icons/hi"; 

const TopBar = () => {
  const [activeLink, setActiveLink] = useState('#home');
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // NEW STATE

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsMenuOpen(false); // Close menu when a link is clicked
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1050);
      if (window.innerWidth > 1050) setIsMenuOpen(false); // Auto-close if screen expands
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={styles.topBarContainer}>
      <div className={styles.logo}>
        <img src={isMobile ? mobileLogo : logo} alt="Company Logo" />
        <span className={styles.logoName}>E. Panganiban Bamboo & Furniture Shop</span>
      </div>

      {/* Added dynamic class to navLinks: open or closed */}
      <nav className={`${styles.navLinks} ${isMenuOpen ? styles.mobileOpen : ''}`}>
        {['#home', '#products', '#about', '#contact'].map((link) => (
          <a
            key={link}
            href={link}
            className={`${styles.navItem} ${activeLink === link ? styles.active : ''}`}
            onClick={() => handleLinkClick(link)}
          >
            {link.slice(1).charAt(0).toUpperCase() + link.slice(2)}
          </a>
        ))}
      </nav>

      {/* Added onClick to toggle the menu */}
      <div className={styles.menuIcon} onClick={toggleMenu}>
        <HiMenuAlt3 />
      </div>
    </header>
  );
};

export default TopBar;
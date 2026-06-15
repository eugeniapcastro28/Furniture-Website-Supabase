import React, { useState, useEffect } from 'react'; // Added useEffect
import styles from './TopBar.module.css';
import logo from '../../assets/No Name.png';
import mobileLogo from '../../assets/LOGO.webp'; // Import your mobile logo
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




// CSS

// .topBarContainer {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0;
//   height: 84px;
//   position: sticky;
//   top: 0;
//   z-index: 1000;
//   background-color: transparent !important;
//   animation: entranceFade 0.4s ease-out forwards;
// }

// @keyframes entranceFade {
//   from {
//     opacity: 0;
//     transform: translateY(-20px);  
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);  
//   }
// }

// .logo {
//   display: flex;
//   align-items: center;
//   gap: 15px;
//   padding-left: 20px;
//   height: 100%;
//   position: relative;
//   background-color: transparent;
// }

// .logo::before {
//   content: "";
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 105%;
//   height: 100%;
//   background-color: #f6efe4;
//   z-index: -1;
//   border-bottom-right-radius: 90px;
//   border-left: none;
// }

// .logo img {
//   height: 62px;
//   width: auto;
//   z-index: 1;
// }

// .logoName {
//   font-size: 1rem;
//   font-weight: 700;
//   color: #6b5027;
//   text-transform: uppercase;
//   letter-spacing: 1.5px;
//   white-space: nowrap;
//   line-height: 1;
//   z-index: 1;
// }

// .navLinks {
//   display: flex;
//   gap: 55px;
//   align-items: center;
//   padding-right: 40px;
// }

// .navLinks a {
//   text-decoration: none;
//   color: #333;
//   font-weight: 500;
//   transition: all 0.3s ease;
//   font-size: 16px;
//   position: relative;
//   padding: 5px 0;
// }

// .navLinks a::after {
//   content: "";
//   position: absolute;
//   left: 0;
//   bottom: -2px;
//   width: 0;
//   height: 3px;
//   background-color: #c3a26f;
//   transition: width 0.3s ease;
//   border-radius: 2px;
// }

// .navLinks a:hover::after {
//   width: 100%;
// }

// .navLinks a:hover {
//   color: #c3a26f;
// }

// .navLinks a.active {
//   color: #c3a26f;
//   font-weight: 600;
// }

// .navLinks a.active::after {
//   width: 100%;
// }

// /* --- RESPONSIVE STYLES --- */

// @media (max-width: 1050px) {
//   .topBarContainer {
//     height: 70px;
//     padding: 0 15px;
//     overflow: visible; 
//   }

//   .logoName {
//     font-size: 0.9rem;
//     white-space: normal;
//     max-width: 250px;
//   }

//   .logo img {
//     height: 50px;
//   }

//   .logo::before {
//     display: none;
//   }

//   .navLinks {
//     display: none;  
//     flex-direction: column;
//     position: absolute;
//     top: 70px;  
//     left: 0;
//     width: 100%;
//     background-color: #ffffff;
//     padding: 20px 0;
//     gap: 10px;
//     box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
//     border-bottom: 2px solid #f0f0f0;
//     z-index: 999;
//   }

//   .navLinks.mobileOpen {
//     display: flex !important;
//     animation: slideDown 0.3s ease forwards;
//   }

//   .navLinks a {
//     width: 100%;
//     text-align: center;
//     padding: 15px 0;
//     font-size: 1rem;
//   }

//   .navLinks a::after {
//     display: none;  
//   }

//   .menuIcon {
//     display: flex !important;
//     align-items: center;
//     justify-content: center;
//     font-size: 28px;
//     cursor: pointer;
//     color: #6b5027;
//   }
// }

// .menuIcon {
//   display: none;
// }

// @keyframes slideDown {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
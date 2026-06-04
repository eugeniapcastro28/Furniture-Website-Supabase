import React, { useState, useEffect } from 'react'
import styles from './App.module.css';
import logo from './assets/LOGO.png';
import TopBar from './components/TopBar/TopBar';
import HomePage from './components/HomePage/HomePage';
import ProductsSection from './components/ProductsSection/ProductsSection';
import CategoriesSection from './components/CategoriesSection/CategoriesSection';
import AboutSection from './components/AboutSection/AboutSection';
import ContactSection from './components/ContactSection/ContactSection';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={logo} alt="Loading" className={styles.loaderLogo} />
      </div>
    );
  }

  return (
    <div className={styles.page} data-scroll-container>
      <TopBar />
      <HomePage />
      <ProductsSection />
      <CategoriesSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default App;

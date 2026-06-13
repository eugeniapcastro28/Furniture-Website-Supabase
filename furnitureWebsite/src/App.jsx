import React, { useState, useEffect } from 'react'
import styles from './App.module.css';
import logo from './assets/LOGO.png';
import TopBar from './components/TopBar/TopBar';
import HomePage from './components/HomePage/HomePage';
import ProductsSection from './components/ProductsSection/ProductsSection';
import CategoriesSection from './components/CategoriesSection/CategoriesSection';
import AboutSection from './components/AboutSection/AboutSection';
import ContactSection from './components/ContactSection/ContactSection';
import ProductDetail from './components/ProductDetail/ProductDetail';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when detail page is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

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
      <main style={{ paddingTop: '76px' }}>
        <HomePage />
        <ProductsSection onSelectProduct={setSelectedProduct} />
        <CategoriesSection />
        <AboutSection />
        <ContactSection />
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct}
        />
      )}
    </div>
  );
};

export default App;
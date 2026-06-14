import React, { useState, useEffect, useLayoutEffect } from 'react'
import styles from './App.module.css';
import logo from './assets/LOGO.png';
import TopBar from './components/TopBar/TopBar';
import HomePage from './components/HomePage/HomePage';
import ProductsSection from './components/ProductsSection/ProductsSection';
import ProductsPage from './components/ProductsPage/ProductsPage';
import CategoriesSection from './components/CategoriesSection/CategoriesSection';
import AboutSection from './components/AboutSection/AboutSection';
import ContactSection from './components/ContactSection/ContactSection';
import ProductDetail from './components/ProductDetail/ProductDetail';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'products'

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

  useLayoutEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentView]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={logo} alt="Loading" className={styles.loaderLogo} />
      </div>
    );
  }

  return (
    <div className={styles.page} data-scroll-container>
      <TopBar currentPage={currentView} onNavigate={setCurrentView} />
      <main style={{ paddingTop: '76px' }}>
        {currentView === 'home' ? (
          <>
            <HomePage />
            <ProductsSection 
              onSelectProduct={setSelectedProduct}
              onViewAll={() => setCurrentView('products')}
            />
            <CategoriesSection />
            <AboutSection />
          </>
        ) : (
          <ProductsPage
            onSelectProduct={setSelectedProduct}
            onBack={() => setCurrentView('home')}
          />
        )}
        {/* Contact Section appears on all pages */}
        <ContactSection />
      </main>

      {/* ProductDetail slides in over the page — no router needed */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default App;
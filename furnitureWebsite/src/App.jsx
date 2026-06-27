import React, { useState, useEffect, useLayoutEffect } from 'react';
import styles from './App.module.css';
import logo from './assets/LOGO.webp';
import TopBar from './components/TopBar/TopBar';
import HomePage from './components/HomePage/HomePage';
import ProductsSection from './components/ProductsSection/ProductsSection';
import ProductsPage from './components/ProductsPage/ProductsPage';
import CategoriesSection from './components/CategoriesSection/CategoriesSection';
import AboutSection from './components/AboutSection/AboutSection';
import ContactSection from './components/ContactSection/ContactSection';
import ProductDetail from './components/ProductDetail/ProductDetail';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

import { supabase } from './config/supabaseClient'; 

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'products'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 🌟 NEW: Track current category filter globally
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);

  // Fetch live products
  const fetchLiveDatabaseItems = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')   
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      const formattedData = (data || []).map(item => ({
        ...item,
        image: item.image_url, 
        images: [item.image_url],
        inStock: item.inStock !== undefined ? item.inStock : true
      }));

      setDbProducts(formattedData);
    } catch (err) {
      console.error('Failed to sync live data:', err.message);
    }
  };

  useEffect(() => {
    if (window.location.pathname === '/admin-portal-showroom') {
      setIsAdminRoute(true);
    }

    const loadApp = async () => {
      await fetchLiveDatabaseItems();
      setIsLoading(false);
    };
    
    loadApp();
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

  const scrollPageToTop = () => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    const execution = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
        scrollContainer.scrollLeft = 0;
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    execution();
    requestAnimationFrame(execution);
    setTimeout(execution, 0);
  };

  useLayoutEffect(() => {
    scrollPageToTop();
  }, [currentView, isAdminRoute]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={logo} alt="Loading" className={styles.loaderLogo} />
      </div>
    );
  }

 if (isAdminRoute) {
  return <AdminDashboard />;
}

  return (
    <div className={styles.page} data-scroll-container>
      <TopBar 
        currentPage={currentView} 
        selectedCategory={selectedCategory} // 🌟 ADDED PROP HERE
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'home') setSelectedCategory('all'); 
        }} 
        onClearProduct={() => setSelectedProduct(null)}
      />
      <main>
        {currentView === 'home' ? (
          <>
            <HomePage />
            <ProductsSection 
              products={dbProducts}
              onSelectProduct={setSelectedProduct}
              onViewAll={() => {
                setSelectedCategory('all');
                setCurrentView('products');
              }}
            />
            {/* 🌟 ADDED PROPS HERE: Send the navigation and selection state controllers down */}
            <CategoriesSection 
              onNavigate={setCurrentView}
              onSetCategory={setSelectedCategory}
            />
            <AboutSection />
          </>
        ) : (
          /* 🌟 ADDED PROP HERE: Pass the state category directly into your standalone catalog page */
          <ProductsPage
            products={dbProducts}
            initialCategory={selectedCategory}
            onSelectProduct={setSelectedProduct}
            onBack={() => {
              setCurrentView('home');
              setSelectedCategory('all');
            }}
          />
        )}
        
        <ContactSection />
      </main>

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          allProducts={dbProducts}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={setSelectedProduct} 
        />
      )}
    </div>
  );
};

export default App;
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

// 🌟 Import your real-time client config wrapper
import { supabase } from './config/supabaseClient'; 

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'products'
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // 🌟 State holding live furniture database inventory
  const [dbProducts, setDbProducts] = useState([]);

  // 🌟 Core data sync hook from Supabase
  const fetchLiveDatabaseItems = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')   
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      // Map Supabase column names to match your frontend keys perfectly
      const formattedData = (data || []).map(item => ({
        ...item,
        // Fallbacks keep older fields stable if missing in specific rows
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

    // Run parallel loaders cleanly
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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    execution();
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

  // Admin routing branch
  if (isAdminRoute) {
    return (
      <div className={styles.page}>
        <main style={{ padding: '20px' }}>
          <a href="/" style={{ display: 'inline-block', color: '#c3a26f', textDecoration: 'none', marginBottom: '20px', fontFamily: 'sans-serif', fontSize: '0.95rem' }}>
            ← Back to Viewing Showroom
          </a>
          <AdminDashboard />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page} data-scroll-container>
      <TopBar 
        currentPage={currentView} 
        onNavigate={setCurrentView} 
        onClearProduct={() => setSelectedProduct(null)}
      />
      <main style={{ paddingTop: '76px' }}>
        {currentView === 'home' ? (
          <>
            <HomePage />
            {/* 🌟 Pass live database products array to your Home landing component */}
            <ProductsSection 
              products={dbProducts}
              onSelectProduct={setSelectedProduct}
              onViewAll={() => setCurrentView('products')}
            />
            <CategoriesSection />
            <AboutSection />
          </>
        ) : (
          /* 🌟 Pass live database products array into your standalone catalog component */
          <ProductsPage
            products={dbProducts}
            onSelectProduct={setSelectedProduct}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        <ContactSection />
      </main>

      {/* 🌟 Pass dynamic items down so similar listings parse context accurately */}
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
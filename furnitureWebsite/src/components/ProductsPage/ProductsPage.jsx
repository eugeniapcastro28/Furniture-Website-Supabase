import React, { useEffect, useState, useRef } from 'react';
import styles from './ProductsPage.module.css';
import { categories } from '../../data/products'; 
import { supabase } from '../../config/supabaseClient'; 

const ProductsPage = ({ onSelectProduct, onBack }) => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleProductIds, setVisibleProductIds] = useState([]);
  const observer = useRef(null);
  
  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading page inventory data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveInventory();
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    const resetViewportToTop = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
        scrollContainer.scrollLeft = 0;
        scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetViewportToTop();
    const backupTimer = setTimeout(resetViewportToTop, 15);
    return () => clearTimeout(backupTimer);
  }, []);

  useEffect(() => {
    if (loading) return; 
    setVisibleProductIds([]);
    
    if (typeof IntersectionObserver === 'undefined' || !products.length) return;

    const elements = document.querySelectorAll('[data-reveal-card]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.revealCard;
          setVisibleProductIds((current) => 
            current.includes(id) ? current : [...current, id]
          );
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10px 0px' });

    elements.forEach((el) => io.observe(el));
    observer.current = io;

    return () => {
      observer.current?.disconnect();
    };
  }, [activeCategory, loading, products]);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => {
        if (!product.category) return false;
        return product.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      });

    const availableProducts = filteredProducts.filter(p => p.in_stock !== false && p.inStock !== false);
    const outOfStockProducts = filteredProducts.filter(p => p.in_stock === false || p.inStock === false);

  const formatPrice = (priceVal) => {
    if (priceVal === undefined || priceVal === null) return '';
    if (typeof priceVal === 'string' && priceVal.includes('₱')) return priceVal;
    return `₱${Number(priceVal).toLocaleString()}`;
  };

  if (loading) {
    return (
      <section className={styles.section} style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <div style={{ color: '#c3a26f', fontSize: '1.2rem', letterSpacing: '1px' }}>Synchronizing full catalog display...</div>
      </section>
    );
  }

  return (
    <section id="products-page" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>All Products</span>
        <h1 className={styles.title}>Browse every piece in our collection</h1>
        <p className={styles.subtitle}>
          Explore the complete range of handcrafted furniture available from E. Panganiban Bamboo & Furniture Shop.
        </p>
      </div>

      <div className={styles.pageActions}>
        <button type="button" onClick={onBack} className={styles.backHomeBtn}>
          <span className={styles.backArrow}>←</span> Back to Homepage
        </button>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeCategory.toLowerCase() === cat.id.toLowerCase() ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.catalogWrapper}>
        
        {/* Available Collection Grid */}
        {availableProducts.length > 0 && (
          <div className={styles.stockSection}>
            <div className={styles.grid}>
              {availableProducts.map((product) => {
                // 🌟 Extract first image from array safely
                const displayImg = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
                return (
                  <div
                    key={product.id}
                    data-reveal-card={product.id}
                    className={`${styles.card} ${visibleProductIds.includes(product.id.toString()) ? styles.cardVisible : ''}`}
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className={styles.imageWrap}>
                      <img src={displayImg} alt={product.name} loading="lazy" className={styles.cardImg} />
                      <div className={styles.cardOverlay}>
                        <span className={styles.viewBtn}>View Details</span>
                      </div>
                      {product.tag && <span className={styles.tag}>{product.tag}</span>}
                    </div>
                    
                    <div className={styles.cardBody}>
                      <div className={styles.cardHeaderRow}>
                        <span className={styles.cardCategory}>
                          {product.category}
                        </span>
                        <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
                      </div>
                      
                      <h3 className={styles.cardName}>{product.name}</h3>
                      <p className={styles.cardDesc}>{product.description}</p>
                      
                      <div className={styles.cardMeta}>
                        <span>{product.material || 'Natural Variant'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Out of Stock Collection Grid */}
        {outOfStockProducts.length > 0 && (
          <div className={`${styles.stockSection} ${styles.outOfStockContainer}`}>
            <div className={styles.sectionSeparator} />
            <h2 className={styles.stockTitle}>Temporarily Out of Stock</h2>
            <div className={styles.grid}>
              {outOfStockProducts.map((product) => {
                // 🌟 Extract first image from array safely
                const displayImg = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
                return (
                  <div
                    key={product.id}
                    data-reveal-card={product.id}
                    className={`${styles.card} ${styles.cardDisabled} ${visibleProductIds.includes(product.id.toString()) ? styles.cardVisible : ''}`}
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className={styles.imageWrap}>
                      <img src={displayImg} alt={product.name} loading="lazy" className={styles.cardImg} />
                      <div className={styles.cardOverlay}>
                        <span className={styles.viewBtn}>View Details</span>
                      </div>
                      <span className={`${styles.tag} ${styles.soldOutTag}`}>Out of Stock</span>
                    </div>
                    
                    <div className={styles.cardBody}>
                      <div className={styles.cardHeaderRow}>
                        <span className={styles.cardCategory}>
                          {product.category}
                        </span>
                        <span className={styles.cardPrice}>{formatPrice(product.price)}</span>
                      </div>
                      
                      <h3 className={styles.cardName}>{product.name}</h3>
                      <p className={styles.cardDesc}>{product.description}</p>
                      
                      <div className={styles.cardMeta}>
                        <span>{product.material || 'Natural Variant'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#666', letterSpacing: '0.5px' }}>
            <p>No listings match this category filtration profile currently.</p>
            <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>Total items in pipeline: {products.length}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
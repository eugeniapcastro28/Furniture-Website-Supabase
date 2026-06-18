import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductsSection.module.css';
import { categories } from '../../data/products'; 
import { supabase } from '../../config/supabaseClient'; 
import { HiArrowRight } from 'react-icons/hi';

const ProductsSection = ({ onSelectProduct, onViewAll }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCardIds, setVisibleCardIds] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const observer = useRef(null);

  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        // Fetch featured items. We omit the rigid limit here so switching tabs has access 
        // to other featured items, then clamp strictly down to 7 on the layout grid.
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .order('display_order', { ascending: true })   
          .order('created_at', { ascending: false });      

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading inventory data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveInventory();
  }, []);

  useEffect(() => {
    if (loading) return; 
    setVisibleCardIds([]);

    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const elements = document.querySelectorAll('[data-reveal-home-card]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.revealHomeCard;
          setVisibleCardIds((current) => (
            current.includes(id) ? current : [...current, id]
          ));
          io.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -10px 0px' 
    });

    elements.forEach((el) => io.observe(el));
    observer.current = io;

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [activeCategory, loading]); 

  // 🌟 Filter first, then slice up to exactly 7 items max for the Homepage display
  const filteredFeatured = (activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)
  ).slice(0, 7);

  if (loading) {
    return (
      <section className={styles.section} style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <div style={{ color: '#c3a26f', fontSize: '1.2rem', letterSpacing: '1px' }}>Loading artisan inventory...</div>
      </section>
    );
  }

  return (
    <section id="products" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Our Collection</span>
        <h2 className={styles.title}>Handcrafted Furniture</h2>
        <p className={styles.subtitle}>
          Each piece is made by skilled artisans using natural materials sourced sustainably.
        </p>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredFeatured.map((product, i) => {
          const displayImg = Array.isArray(product.image_url) ? product.image_url[0] : product.image_url;
          return (
            <div
              key={product.id}
              data-reveal-home-card={product.id}
              className={`${styles.card} ${i === 0 ? styles.cardFeatured : ''} ${
                visibleCardIds.includes(product.id.toString()) ? styles.cardVisible : ''
              }`}
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
                <span className={styles.cardCategory}>{product.category}</span>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardDesc}>{product.description}</p>
                <div className={styles.cardMeta}>
                  <span>₱{product.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* View All Products Action Card */}
        <div 
          data-reveal-home-card="view-all-cta"
          className={`${styles.card} ${styles.viewAllCard} ${
            visibleCardIds.includes('view-all-cta') ? styles.cardVisible : ''
          }`}
          onClick={() => onViewAll && onViewAll()}
        >
          <div className={styles.viewAllContent}>
            <div className={styles.iconCircle}>
              <HiArrowRight className={styles.viewAllIcon} />
            </div>
            <h3 className={styles.viewAllTitle}>View All Products</h3>
            <p className={styles.viewAllText}>
              Explore our full catalog of handcrafted local items ({products.length} pieces)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
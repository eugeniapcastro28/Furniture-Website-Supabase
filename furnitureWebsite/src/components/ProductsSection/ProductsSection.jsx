import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductsSection.module.css';
import { categories } from '../../data/products'; // Keep static categories if desired
import { supabase } from '../../config/supabaseClient'; // 🌟 Import your client configuration
import { HiArrowRight } from 'react-icons/hi';

const ProductsSection = ({ onSelectProduct, onViewAll }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCardIds, setVisibleCardIds] = useState([]);
  const [products, setProducts] = useState([]); // 🌟 Dynamic product state
  const [loading, setLoading] = useState(true); // 🌟 Loading status management
  const observer = useRef(null);

  // ── 1. LIVE DATABASE DATA FETCH ────────────────────────────────────
  useEffect(() => {
    const fetchLiveInventory = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }); // Newest uploads appear first

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

  // ── 2. INTERSECTION OBSERVER ANIMATION REVEALS ─────────────────────
  useEffect(() => {
    if (loading) return; // Prevent observer from running if elements aren't painted yet
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
  }, [activeCategory, loading]); // Added loading dependency to re-trigger observer securely

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

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

      {/* Filter Tabs */}
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

      {/* Products Grid */}
      <div className={styles.grid}>
        {filtered.map((product, i) => (
          <div
            key={product.id}
            data-reveal-home-card={product.id}
            className={`${styles.card} ${i === 0 ? styles.cardFeatured : ''} ${
              visibleCardIds.includes(product.id.toString()) ? styles.cardVisible : ''
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className={styles.imageWrap}>
              {/* 🌟 Updated src to read product.image_url pointing to Supabase bucket storage */}
              <img src={product.image_url} alt={product.name} loading="lazy" className={styles.cardImg} />
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
                {/* Fallback values displayed cleanly if field parameter variations are omitted */}
                <span>₱{product.price?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

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
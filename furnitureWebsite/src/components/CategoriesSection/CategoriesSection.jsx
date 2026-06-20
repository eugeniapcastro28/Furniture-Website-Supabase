import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient'; 
import styles from './CategoriesSection.module.css';

const CategoriesSection = ({ onNavigate, onSetCategory }) => {
  const [dbCategories, setDbCategories] = useState([]); 
  const [categoryCounts, setCategoryCounts] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [visibleCategoryIds, setVisibleCategoryIds] = useState([]); 
  const observerRef = useRef(null);

  // FETCH LIVE DATA
  useEffect(() => {
    const fetchLiveShowroomData = async () => {
      try {
        setLoading(true);

        // Fetch dynamic categories ordered correctly
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true });

        if (catError) throw catError;

        // Fetch the active category references from products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('category');

        if (prodError) throw prodError;

        if (prodData) {
          const counts = prodData.reduce((acc, currentItem) => {
            const catId = currentItem.category?.toLowerCase() || '';
            acc[catId] = (acc[catId] || 0) + 1;
            return acc;
          }, {});
          setCategoryCounts(counts);
        }

        setDbCategories(catData || []);
      } catch (err) {
        console.error('Failed to look up dynamic catalog values:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveShowroomData();
  }, []);

  // Scroll animations observer
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || dbCategories.length === 0) return undefined;

    const elements = document.querySelectorAll('[data-reveal-category-card]');
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.revealCategoryCard;
          setVisibleCategoryIds((current) => (
            current.includes(id) ? current : [...current, id]
          ));
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -10px 0px' 
    });

    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [dbCategories]);

  const handleCategoryClick = (categorySlug, event) => {
    event.preventDefault(); 
    
    if (onSetCategory) {
      // 🌟 Passing the slug value so that ProductsPage filters match perfectly
      onSetCategory(categorySlug);
    }

    if (onNavigate) {
      onNavigate('products');
    }
  };

  if (loading) {
    return (
      <section id="categories" className={styles.section} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: '#f5ede0', fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>Loading Collections...</p>
      </section>
    );
  }

  return (
    <section id="categories" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Browse</span>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>Explore our handcrafted collections by material and style</p>
      </div>

      <div className={styles.grid}>
        {dbCategories.map((cat, i) => {
          const lookupKey = cat.slug || cat.id || '';
          const itemCount = categoryCounts[lookupKey.toString().toLowerCase()] || 0;

          return (
            <a
              key={cat.id}
              href="#products"
              data-reveal-category-card={cat.id} 
              className={`${styles.card} ${i === 0 ? styles.cardTall : ''} ${
                visibleCategoryIds.includes(cat.id.toString()) ? styles.cardVisible : ''
              }`}
              // 🌟 FIXED: Pass cat.slug instead of cat.id to line up with the active tab evaluation rules
              onClick={(event) => handleCategoryClick(cat.slug, event)} 
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img 
                src={cat.image_url} 
                alt={cat.label} 
                loading="lazy" 
                className={styles.cardImg} 
                onError={(e) => { e.target.src = 'https://via.section.com/600x800'; }}
              />
              <div className={`${styles.cardOverlay} ${hovered === cat.id ? styles.overlayHovered : ''}`} />
              <div className={styles.cardContent}>
                <p className={styles.cardCount}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                <h3 className={styles.cardLabel}>{cat.label}</h3>
                <p className={styles.cardDesc}>{cat.description}</p>
                <span className={styles.cardArrow}>→</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
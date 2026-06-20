import React, { useState, useEffect, useRef } from 'react';
import styles from './CategoriesSection.module.css';
import { categories, products } from '../../data/products';

import img1 from '../../assets/1.webp';
import img2 from '../../assets/2.webp';
import img3 from '../../assets/3.webp';

const categoryImages = {
  rattan: img1,
  wooden: img2,
  bamboo: img3,
  outdoor: img1,
};

// FIX 1: Pass down onNavigate and optionally onSetCategory as props
const CategoriesSection = ({ onNavigate, onSetCategory }) => {
  const [hovered, setHovered] = useState(null);
  const [visibleCategoryIds, setVisibleCategoryIds] = useState([]); 
  const observerRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

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
  }, []);

  // FIX 2: Handle the card click gracefully without letting the browser native anchor hijack it
  const handleCategoryClick = (categoryId, event) => {
    event.preventDefault(); // Stop native layout anchor jumping
    
    // Optional: If your products page accepts a filter state, update it here
    if (onSetCategory) {
      onSetCategory(categoryId);
    }

    // Trigger the clean page switch view mechanism
    if (onNavigate) {
      onNavigate('products');
    }
  };

  const enriched = categories.map(cat => ({
    ...cat,
    image: categoryImages[cat.id] || img1,
    count: products.filter(p => p.category === cat.id).length,
  }));

  return (
    <section id="categories" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Browse</span>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>Explore our handcrafted collections by material and style</p>
      </div>

      <div className={styles.grid}>
        {enriched.map((cat, i) => (
          <a
            key={cat.id}
            href="#products"
            data-reveal-category-card={cat.id} 
            className={`${styles.card} ${i === 0 ? styles.cardTall : ''} ${
              visibleCategoryIds.includes(cat.id.toString()) ? styles.cardVisible : ''
            }`}
            // FIX 3: Attach the click handler to cleanly process the transition context
            onClick={(event) => handleCategoryClick(cat.id, event)}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={cat.image} alt={cat.label} loading="lazy" className={styles.cardImg} />
            <div className={`${styles.cardOverlay} ${hovered === cat.id ? styles.overlayHovered : ''}`} />
            <div className={styles.cardContent}>
              <p className={styles.cardCount}>{cat.count} items</p>
              <h3 className={styles.cardLabel}>{cat.label}</h3>
              <p className={styles.cardDesc}>{cat.description}</p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { featuredProducts } from '../../data/products';

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Rotate through background images automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 5000); // Changes image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle escape key to clear things if necessary, though modal is removed
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape'); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const active = featuredProducts[activeIndex];

  return (
    <section id="home" className={styles.hero}>
      {/* Background image layer */}
      <div className={styles.heroBg}>
        {featuredProducts.map((p, i) => (
          <div
            key={p.id}
            className={`${styles.heroBgSlide} ${i === activeIndex ? styles.heroBgActive : ''}`}
            style={{ backgroundImage: `url(${p.image})` }}
          />
        ))}
        <div className={styles.heroBgOverlay} />
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroLeft}>
          <span className={styles.heroEyebrow}>Handcrafted in the Philippines</span>
          <h1 className={styles.heroTitle} key={active.id}>
            {active.name}
          </h1>
          <p className={styles.heroDesc}>{active.description}</p>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Material</span>
              <span className={styles.metaValue}>{active.material}</span>
            </span>
            <span className={styles.metaDivider} />
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Size</span>
              <span className={styles.metaValue}>{active.dimensions}</span>
            </span>
          </div>
          <a href="#products" className={styles.heroCta}>View All Products</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </section>
  );
};

export default HomePage;
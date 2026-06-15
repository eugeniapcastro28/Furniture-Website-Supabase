import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { featuredProducts } from '../../data/products';

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rotate through background images automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(activeIndex);
      setIsTransitioning(true);
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 5000); // Changes image every 5 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Turn off transition buffer once opacity has fully completed
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 1200);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isTransitioning]);

  const active = featuredProducts[activeIndex];
  const previous = featuredProducts[prevIndex];

  return (
    <section id="home" className={styles.hero}>
      {/* Background image layer */}
      <div className={styles.heroBg}>
        {/* Previous slide stays underneath while fading out */}
        {isTransitioning && previous && (
          <div
            className={`${styles.heroBgSlide} ${styles.heroBgFadeOut}`}
            style={{ backgroundImage: `url(${previous.image})` }}
          />
        )}
        
        {/* Active current slide on top fading in cleanly */}
        <div
          key={active.id}
          className={`${styles.heroBgSlide} ${styles.heroBgActive}`}
          style={{ backgroundImage: `url(${active.image})` }}
        />
        
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
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Material</span>
              <span className={styles.metaValue}>{active.material}</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Size</span>
              <span className={styles.metaValue}>{active.dimensions}</span>
            </div>
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
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

  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      scrollContainer.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const active = featuredProducts[activeIndex];
  const previous = featuredProducts[prevIndex];

  // 🌟 PERFORMANCE WIN: Isolate the absolute first product asset to determine LCP initialization
  const initialLCPId = featuredProducts[0]?.id;

  return (
    <section id="home" className={styles.hero}>
      {/* Background image layer */}
      <div className={styles.heroBg}>
        {isTransitioning && previous && (
          <img
            src={previous.image}
            alt=""
            role="presentation"
            /* 🌟 Hardcoded width/height properties stop layout bouncing */
            width="1400"
            height="788"
            className={`${styles.heroBgSlide} ${styles.heroBgFadeOut}`}
          />
        )}
        
        {/* Active current slide on top fading in cleanly */}
        <img
          key={active.id}
          src={active.image}
          alt={active.name}
          /* 🌟 CRITICAL FIXES FOR LIGHTHOUSE LCP: */
          fetchpriority={active.id === initialLCPId ? "high" : "auto"} 
          loading={active.id === initialLCPId ? "eager" : "lazy"} 
          width="1400"
          height="788"
          className={`${styles.heroBgSlide} ${styles.heroBgActive}`}
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
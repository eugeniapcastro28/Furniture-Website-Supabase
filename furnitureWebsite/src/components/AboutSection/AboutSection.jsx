import React, { useState, useEffect, useRef } from 'react';
import styles from './AboutSection.module.css';

const stats = [
  { value: '20+', label: 'Years of Craft' },
  { value: '500+', label: 'Pieces Made' },
  { value: '100%', label: 'Natural Materials' },
  { value: 'Local', label: 'Filipino Artisans' },
];

const AboutSection = () => {
  const [visibleBlocks, setVisibleBlocks] = useState([]); // 🌟 Tracks scroll animated column blocks
  const observerRef = useRef(null);

  // ── INTERSECTION OBSERVER ANIMATION REVEALS ──────────────────────────────
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const elements = document.querySelectorAll('[data-reveal-about-block]');

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const blockName = entry.target.dataset.revealAboutBlock;
          setVisibleBlocks((current) => (
            current.includes(blockName) ? current : [...current, blockName]
          ));
          observerRef.current.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Matches the flawless entry timing profile from ProductsPage
      rootMargin: '0px 0px -10px 0px'
    });

    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        
        {/* ── IMAGE COLUMN REVEAL ── */}
        <div 
          data-reveal-about-block="image-column"
          className={`${styles.imageCol} ${visibleBlocks.includes('image-column') ? styles.blockVisible : ''}`}
        >
          <div className={styles.imageFrame}>
            <div className={styles.imageBg} />
            <div className={styles.imageCard}>
              <img
                src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Artisan crafting rattan furniture"
                className={styles.mainImg}
                loading="lazy"
              />
            </div>
            <div className={styles.accentCard}>
              <img
                src="https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Natural materials"
                className={styles.accentImg}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── TEXT COLUMN REVEAL ── */}
        <div 
          data-reveal-about-block="text-column"
          className={`${styles.textCol} ${visibleBlocks.includes('text-column') ? styles.blockVisible : ''}`}
        >
          <span className={styles.eyebrow}>Our Story</span>
          <h2 className={styles.title}>Crafted with Passion,<br />Built to Last</h2>
          <p className={styles.body}>
            E. Panganiban Bamboo &amp; Furniture Shop has been crafting handmade furniture
            for over two decades. Every piece leaving our workshop is shaped by skilled
            Filipino hands using sustainably sourced rattan, bamboo, and hardwood.
          </p>
          <p className={styles.body}>
            We believe furniture should tell a story — one of patience, artistry, and care
            for the natural world. Our collections bring warmth and character to any home,
            blending traditional Filipino craft with timeless design.
          </p>

          <div className={styles.stats}>
            {stats.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
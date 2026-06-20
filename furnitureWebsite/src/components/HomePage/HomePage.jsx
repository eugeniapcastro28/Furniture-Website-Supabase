import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [slides, setSlides] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch hero slides from Supabase
  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data?.length) setSlides(data);
      setLoading(false);
    };
    fetchSlides();
  }, []);

  // Rotate through background images automatically
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setPrevIndex(activeIndex);
      setIsTransitioning(true);
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000); // Changes image every 5 seconds

    return () => clearInterval(interval);
  }, [activeIndex, slides.length]);

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

  // Don't render the hero until slides are loaded, to avoid flashing empty content
  if (loading) {
    return <section id="home" className={styles.hero} style={{ background: '#1a1510' }} />;
  }

  // No slides configured yet in the admin panel
  if (!slides.length) {
    return (
      <section id="home" className={styles.hero} style={{ background: '#1a1510' }}>
        <div className={styles.heroContent}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle} style={{ color: '#f5ede0' }}>
              Welcome to Our Showroom
            </h1>
            <p className={styles.heroDesc}>Add hero slides from the admin panel to showcase products here.</p>
          </div>
        </div>
      </section>
    );
  }

  const active = slides[activeIndex];
  const previous = slides[prevIndex];

  // 🌟 PERFORMANCE WIN: Isolate the absolute first slide asset to determine LCP initialization
  const initialLCPId = slides[0]?.id;

  return (
    <section id="home" className={styles.hero}>
      {/* Background image layer */}
      <div className={styles.heroBg}>
        {isTransitioning && previous && (
          <img
            src={previous.image_url}
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
          src={active.image_url}
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
            {active.material && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Material</span>
                <span className={styles.metaValue}>{active.material}</span>
              </div>
            )}
            {active.material && active.dimensions && <div className={styles.metaDivider} />}
            {active.dimensions && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Size</span>
                <span className={styles.metaValue}>{active.dimensions}</span>
              </div>
            )}
          </div>
          <a href="#products" className={styles.heroCta}>View All Products</a>
        </div>
      </div>

      {/* Slide dots — only show when there's more than one slide */}
      {slides.length > 1 && (
        <div className={styles.slideDots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.slideDot} ${i === activeIndex ? styles.slideDotActive : ''}`}
              onClick={() => {
                setPrevIndex(activeIndex);
                setIsTransitioning(true);
                setActiveIndex(i);
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>
    </section>
  );
};

export default HomePage;
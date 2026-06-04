import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styles from './HomePage.module.css';
import { featuredProducts } from '../../data/products';

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalImg, setModalImg] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setModalImg(null); };
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

        <div className={styles.heroRight}>
          <div className={styles.carouselBox}>
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              loop
              speed={800}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              onSwiper={(s) => { swiperRef.current = s; }}
              onRealIndexChange={(s) => setActiveIndex(s.realIndex)}
              style={{ width: '100%', height: '100%' }}
            >
              {featuredProducts.map((p) => (
                <SwiperSlide key={p.id}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className={styles.slideImg}
                    loading="eager"
                    onClick={() => setModalImg(p)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {active.tag && (
              <span className={styles.tagBadge}>{active.tag}</span>
            )}

            <div className={styles.dots}>
              {featuredProducts.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.thumbnails}>
            {featuredProducts.map((p, i) => (
              <button
                key={p.id}
                className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
                onClick={() => swiperRef.current?.slideToLoop(i)}
              >
                <img src={p.image} alt={p.name} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>

      {/* Modal */}
      {modalImg && (
        <div className={styles.modalOverlay} onClick={() => setModalImg(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalImg(null)}>✕</button>
            <img src={modalImg.image} alt={modalImg.name} className={styles.modalImage} />
            <p className={styles.modalTitle}>{modalImg.name}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;

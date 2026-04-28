import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from './HomePage.module.css';

import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';

const heroImages = [img1, img2, img3];

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const getImg = (offset) =>
    heroImages[(activeIndex + offset + heroImages.length) % heroImages.length];

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>

        {/* LEFT: TEXT */}
        <div className={styles.heroTextContent}>
          <h1 className={styles.heroTitle}>FURNITURE WEBSITE SAMPLE</h1>
          <p className={styles.heroSubtitle}>
            Sample Text Only Sample Text Only Sample Text Only Sample Text Only
          </p>
        </div>

        {/* RIGHT: CASCADING BOXES */}
        <div className={styles.heroCarouselWrapper}>

          {/* MAIN SWIPER BOX */}
          <div className={styles.mainCarouselBox}>
            <Swiper
              modules={[Autoplay, Navigation]}
              loop={true}
              speed={600}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              navigation={{
                prevEl: `.${styles.arrowLeft}`,
                nextEl: `.${styles.arrowRight}`,
              }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
              style={{ width: '100%', height: '100%' }}
            >
              {heroImages.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img} alt={`Furniture ${i + 1}`} className={styles.mainImage} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Arrows */}
            <button className={`${styles.arrowBtn} ${styles.arrowLeft}`} aria-label="Previous">&#8249;</button>
            <button className={`${styles.arrowBtn} ${styles.arrowRight}`} aria-label="Next">&#8250;</button>

            {/* Dots */}
            <div className={styles.dots}>
              {heroImages.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                />
              ))}
            </div>
          </div>

          {/* SIDE PREVIEW 1 */}
          <div className={styles.sideBoxSmall} onClick={() => swiperRef.current?.slideNext()}>
            <img src={getImg(1)} alt="Preview next" className={styles.sideImage} />
          </div>

          {/* SIDE PREVIEW 2 */}
          <div className={styles.sideBoxSmaller} onClick={() => swiperRef.current?.slideNext()}>
            <img src={getImg(2)} alt="Preview after" className={styles.sideImage} />
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;
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

        {/* RIGHT: CAROUSEL */}
        <div className={styles.heroCarouselWrapper}>
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
        </div>

      </section>
    </div>
  );
};

export default HomePage;
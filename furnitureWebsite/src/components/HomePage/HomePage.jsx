import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from './HomePage.module.css';

import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';

const slidesData = [
  { img: img1, title: "Rattan Sala Set", sub: "Handcrafted comfort for your living room." },
  { img: img2, title: "Wooden Sala Set", sub: "Premium mahogany finish with durable cushions." },
  { img: img3, title: "Wooden Cleopatra", sub: "Elegant vintage design for luxury lounging." },
];

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [modalImg, setModalImg] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalImg(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to wrap the first letter of every word
  const formatTitle = (text) => {
    return text.split(' ').map((word, index) => (
      <span key={index}>
        <span className={styles.firstLetter}>{word[0]}</span>
        {word.slice(1)}{' '}
      </span>
    ));
  };

  return (
    <div className={styles.homeContainer}>
      <section className={styles.heroSection}>
        
        <div className={styles.heroCarouselWrapper}>
          {/* TEXT CONTENT - Now inside the wrapper to overlap */}
          <div className={styles.heroTextOverlay}>
            <h1 className={styles.heroTitle}>
              {formatTitle(slidesData[activeIndex].title)}
            </h1>
            <p className={styles.heroSubtitle}>
              {slidesData[activeIndex].sub}
            </p>
          </div>

          <div className={styles.mainCarouselBox}>
            <Swiper
              modules={[Autoplay, Navigation]}
              loop={true}
              speed={600}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
              style={{ width: '100%', height: '100%' }}
            >
              {slidesData.map((slide, i) => (
                <SwiperSlide key={i}>
                  <img src={slide.img} alt={slide.title} className={styles.mainImage} 
                  onClick={() => setModalImg(slide)} />
                </SwiperSlide>
              ))}
            </Swiper> 
            
            <div className={styles.dots}>
              {slidesData.map((_, i) => (
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

      {modalImg && (
        <div className={styles.modalOverlay} onClick={() => setModalImg(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalImg(null)}>✕</button>
            <img src={modalImg.img} alt={modalImg.title} className={styles.modalImage} />
            <p className={styles.modalTitle}>{modalImg.title}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
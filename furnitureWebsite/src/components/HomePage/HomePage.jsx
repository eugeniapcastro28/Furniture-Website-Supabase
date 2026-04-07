import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from './HomePage.module.css';

// Dynamically import your images from assets
import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';
import img4 from '../../assets/4.png';
import img5 from '../../assets/5.png';

const HomePage = () => {
  const heroImages = [img1, img2, img3, img4, img5];

  return (
    <div className={styles.homeContainer}>
      {/* --- HERO SLIDER SECTION --- */}
      <section className={styles.heroSlider}>
        <Swiper
          spaceBetween={0} // No gap between slides
          centeredSlides={true}
          slidesPerView={1}
          loop={true} // Infinite loop
          speed={1000} // Smooth transition speed (1 second)
          autoplay={{
            delay: 5000, // Stay on each slide for 5 seconds
            disableOnInteraction: false, // Continue playing after user interaction
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true, // Cool effect where active dot is bigger
          }}
          navigation={{
            nextEl: `.${styles.swiperButtonNext}`, // Custom next arrow class
            prevEl: `.${styles.swiperButtonPrev}`, // Custom prev arrow class
          }}
          modules={[Autoplay, Pagination, Navigation]}
          className={styles.mySwiper}
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <div className={styles.imageWrapper}>
                <img src={image} alt={`Bamboo Furniture Showcase ${index + 1}`} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation Arrows (Matched to your gold color) */}
          <div className={`${styles.swiperButtonPrev} swiper-button-prev`}>
            <HiOutlineChevronLeft />
          </div>
          <div className={`${styles.swiperButtonNext} swiper-button-next`}>
            <HiOutlineChevronRight />
          </div>
        </Swiper>
      </section>

      {/* --- Rest of your HomePage content (Grid, Features, etc.) --- */}
      <section className={styles.fillerContent}>
        <h2>Your Premium Bamboo Journey Starts Here</h2>
        <p>This is where your product category grid or featured items will go...</p>
      </section>
    </div>
  );
};

export default HomePage;
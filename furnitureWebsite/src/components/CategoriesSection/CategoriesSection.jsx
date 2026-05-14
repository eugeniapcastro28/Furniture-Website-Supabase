import React from 'react';
import styles from './CategoriesSection.module.css';

import img1 from '../../assets/1.webp';
import img2 from '../../assets/2.webp';
import img3 from '../../assets/3.webp';

const categories = [
  { label: 'Rattan',  image: img1 },
  { label: 'Wooden',  image: img2 },
  { label: 'Bamboo',  image: img3 },
  { label: 'Outdoor', image: img1 }, // placeholder — swap later
];

const CategoriesSection = () => {
  return (
    <section id="categories" className={styles.categoriesContainer}>
      <h2 className={styles.sectionTitle}>Shop by Category</h2>
      <p className={styles.sectionSubtitle}>Explore our handcrafted furniture collections</p>

      <div className={styles.categoriesGrid}>
        {categories.map((cat, i) => (
          <div key={i} className={styles.categoryCard}>
            <div className={styles.imageWrapper}>
              <img src={cat.image} loading="lazy" alt={cat.label} width={400} height={400} className={styles.categoryImage} />
              <div className={styles.imageOverlay} />
            </div>
            <p className={styles.categoryLabel}>{cat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
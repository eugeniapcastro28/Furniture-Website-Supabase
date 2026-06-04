import React, { useState } from 'react';
import styles from './CategoriesSection.module.css';
import { categories, products } from '../../data/products';

import img1 from '../../assets/1.webp';
import img2 from '../../assets/2.webp';
import img3 from '../../assets/3.webp';

const categoryImages = {
  rattan: img1,
  wooden: img2,
  bamboo: img3,
  outdoor: img1,
};

const CategoriesSection = () => {
  const [hovered, setHovered] = useState(null);

  const enriched = categories.map(cat => ({
    ...cat,
    image: categoryImages[cat.id] || img1,
    count: products.filter(p => p.category === cat.id).length,
  }));

  return (
    <section id="categories" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Browse</span>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>Explore our handcrafted collections by material and style</p>
      </div>

      <div className={styles.grid}>
        {enriched.map((cat, i) => (
          <a
            key={cat.id}
            href="#products"
            className={`${styles.card} ${i === 0 ? styles.cardTall : ''}`}
            onMouseEnter={() => setHovered(cat.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={cat.image} alt={cat.label} loading="lazy" className={styles.cardImg} />
            <div className={`${styles.cardOverlay} ${hovered === cat.id ? styles.overlayHovered : ''}`} />
            <div className={styles.cardContent}>
              <p className={styles.cardCount}>{cat.count} items</p>
              <h3 className={styles.cardLabel}>{cat.label}</h3>
              <p className={styles.cardDesc}>{cat.description}</p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

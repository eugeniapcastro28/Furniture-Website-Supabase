import React from 'react';
import styles from './CategoriesSection.module.css';

const categories = [
  { label: 'Rattan', icon: '🪑' },
  { label: 'Wooden', icon: '🪵' },
  { label: 'Bamboo', icon: '🎋' },
  { label: 'Outdoor', icon: '🌿' },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className={styles.categoriesContainer}>
      <h2 className={styles.sectionTitle}>Shop by Category</h2>
      <p className={styles.sectionSubtitle}>Explore our handcrafted furniture collections</p>

      <div className={styles.categoriesGrid}>
        {categories.map((cat, i) => (
          <div key={i} className={styles.categoryCard}>
            <span className={styles.categoryIcon}>{cat.icon}</span>
            <p className={styles.categoryLabel}>{cat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
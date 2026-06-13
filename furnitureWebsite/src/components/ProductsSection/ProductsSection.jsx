import React, { useState } from 'react';
import styles from './ProductsSection.module.css';
import { products, categories } from '../../data/products';

// onSelectProduct is passed from App — clicking a card opens ProductDetail
const ProductsSection = ({ onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Our Collection</span>
        <h2 className={styles.title}>Handcrafted Furniture</h2>
        <p className={styles.subtitle}>
          Each piece is made by skilled artisans using natural materials sourced sustainably.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className={styles.grid}>
        {filtered.map((product, i) => (
          <div
            key={product.id}
            className={`${styles.card} ${i === 0 ? styles.cardFeatured : ''}`}
            onClick={() => onSelectProduct(product)}
          >
            <div className={styles.imageWrap}>
              <img src={product.image} alt={product.name} loading="lazy" className={styles.cardImg} />
              <div className={styles.cardOverlay}>
                <span className={styles.viewBtn}>View Details</span>
              </div>
              {product.tag && <span className={styles.tag}>{product.tag}</span>}
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardCategory}>{product.category}</span>
              <h3 className={styles.cardName}>{product.name}</h3>
              <p className={styles.cardDesc}>{product.description}</p>
              <div className={styles.cardMeta}>
                <span>{product.material}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
import React, { useEffect, useState } from 'react';
import styles from '../ProductsSection/ProductsSection.module.css';
import { products, categories } from '../../data/products';

const ProductsPage = ({ onSelectProduct, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const page = document.querySelector('[data-scroll-container]');
    const section = document.getElementById('products-page');
    if (section) {
      section.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
    }
    if (page) {
      page.scrollTop = 0;
      page.scrollLeft = 0;
      page.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => product.category === activeCategory);

  return (
    <section id="products-page" className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>All Products</span>
        <h1 className={styles.title}>Browse every piece in our collection</h1>
        <p className={styles.subtitle}>
          Explore the complete range of handcrafted furniture available from E. Panganiban Bamboo & Furniture Shop.
          Use the filters below to narrow your search by material, style, or category.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        maxWidth: '1200px',
        margin: '0 auto 40px',
      }}>
        <div />
        <button
          type="button"
          onClick={onBack}
          style={{
            border: 'none',
            borderRadius: '999px',
            padding: '14px 24px',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          Back to Homepage
        </button>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`${styles.card} ${index === 0 ? styles.cardFeatured : ''}`}
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

export default ProductsPage;

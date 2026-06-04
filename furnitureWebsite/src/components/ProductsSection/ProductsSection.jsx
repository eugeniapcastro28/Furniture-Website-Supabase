import React, { useState } from 'react';
import styles from './ProductsSection.module.css';
import { products, categories } from '../../data/products';

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalItem, setModalItem] = useState(null);

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
            onClick={() => setModalItem(product)}
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

      {/* Modal */}
      {modalItem && (
        <div className={styles.modalOverlay} onClick={() => setModalItem(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setModalItem(null)}>✕</button>
            <div className={styles.modalInner}>
              <div className={styles.modalImgWrap}>
                <img src={modalItem.image} alt={modalItem.name} className={styles.modalImg} />
                {modalItem.tag && <span className={styles.modalTag}>{modalItem.tag}</span>}
              </div>
              <div className={styles.modalInfo}>
                <span className={styles.modalCategory}>{modalItem.category}</span>
                <h3 className={styles.modalName}>{modalItem.name}</h3>
                <p className={styles.modalDesc}>{modalItem.description}</p>
                <div className={styles.modalDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Material</span>
                    <span className={styles.detailValue}>{modalItem.material}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Dimensions</span>
                    <span className={styles.detailValue}>{modalItem.dimensions}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Category</span>
                    <span className={styles.detailValue} style={{ textTransform: 'capitalize' }}>{modalItem.category}</span>
                  </div>
                </div>
                <a href="#contact" className={styles.inquireBtn} onClick={() => setModalItem(null)}>
                  Inquire About This Item
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;

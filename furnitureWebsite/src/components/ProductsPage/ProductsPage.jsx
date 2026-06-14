import React, { useEffect, useState } from 'react';
import styles from './ProductsPage.module.css';
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

  // 1. First, apply category filters
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((product) => product.category === activeCategory);

  // 2. Separate filtered results by inventory availability status
  const availableProducts = filteredProducts.filter(p => p.inStock !== false);
  const outOfStockProducts = filteredProducts.filter(p => p.inStock === false);

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

      <div className={styles.pageActions}>
        <button
          type="button"
          onClick={onBack}
          className={styles.backHomeBtn}
        >
          <span className={styles.backArrow}>←</span> Back to Homepage
        </button>
      </div>

      {/* Categories Switcher */}
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

      {/* ── SECTION 1: AVAILABLE PRODUCTS ── */}
      {availableProducts.length > 0 && (
        <div className={styles.stockSection}>
          {/* <h2 className={styles.stockTitle}>Available Pieces</h2> */}
          <div className={styles.grid}>
            {availableProducts.map((product) => (
              <div
                key={product.id}
                className={styles.card}
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
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.cardCategory}>{product.category}</span>
                    {product.price && <span className={styles.cardPrice}>{product.price}</span>}
                  </div>
                  
                  <h3 className={styles.cardName}>{product.name}</h3>
                  <p className={styles.cardDesc}>{product.description}</p>
                  
                  <div className={styles.cardMeta}>
                    <span>{product.material}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 2: OUT OF STOCK PRODUCTS ── */}
      {outOfStockProducts.length > 0 && (
        <div className={`${styles.stockSection} ${styles.outOfStockContainer}`}>
          <div className={styles.sectionSeparator} />
          <h2 className={styles.stockTitle}>Temporarily Out of Stock</h2>
          <div className={styles.grid}>
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className={`${styles.card} ${styles.cardDisabled}`}
                onClick={() => onSelectProduct(product)} // Kept clickable so users can still see details or backorder
              >
                <div className={styles.imageWrap}>
                  <img src={product.image} alt={product.name} loading="lazy" className={styles.cardImg} />
                  <div className={styles.cardOverlay}>
                    <span className={styles.viewBtn}>View Details</span>
                  </div>
                  <span className={`${styles.tag} ${styles.soldOutTag}`}>Out of Stock</span>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.cardCategory}>{product.category}</span>
                    {product.price && <span className={styles.cardPrice}>{product.price}</span>}
                  </div>
                  
                  <h3 className={styles.cardName}>{product.name}</h3>
                  <p className={styles.cardDesc}>{product.description}</p>
                  
                  <div className={styles.cardMeta}>
                    <span>{product.material}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback state if both containers filter to empty */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          No products found in this category.
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
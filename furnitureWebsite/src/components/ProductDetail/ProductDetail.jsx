import React, { useState, useEffect } from 'react';
import styles from './ProductDetail.module.css';
import { products } from '../../data/products';

const ProductDetail = ({ product, onClose, onSelectProduct }) => {
  const [activeImg, setActiveImg] = useState(0);

  // Reset gallery when product changes
  useEffect(() => { setActiveImg(0); }, [product]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const images = product.images?.length ? product.images : [product.image];

  // Related: same category, not self, max 3
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className={styles.overlay}>
      <div className={styles.page}>

        {/* ── Top Bar / Breadcrumbs ─────────────────── */}
        <div className={styles.topBar}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <span className={styles.crumbLink} onClick={onClose}>Collection</span>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{product.name}</span>
          </nav>
        </div>

        {/* ── Main Layout ──────────────────────────── */}
        <div className={styles.layout}>

          {/* Left — Gallery */}
          <div className={styles.gallery}>
            <div className={styles.galleryHeaderActions}>
              <button className={styles.inlineBackBtn} onClick={onClose}>
                <span className={styles.backArrow}>←</span>
                <span>Back to Collection</span>
              </button>
            </div>

            <div className={styles.mainImgWrap}>
              <img
                key={activeImg}
                src={images[activeImg]}
                alt={`${product.name} view ${activeImg + 1}`}
                className={styles.mainImg}
              />
              {product.tag && <span className={styles.tag}>{product.tag}</span>}
            </div>

            {images.length > 1 && (
              <div className={styles.thumbRow}>
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumb} ${idx === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={src} alt="" className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className={styles.info}>
            
            {/* STICKY HEADER BLOCK: Locks Category, Name, and Price */}
            <div className={styles.stickyHeader}>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.name}>{product.name}</h1>
              {product.price && <p className={styles.price}>{product.price}</p>}
            </div>

            {/* SCROLLABLE CONTENT BLOCK: Scrolls smoothly underneath */}
            <div className={styles.scrollableContent}>
              <p className={styles.desc}>{product.description}</p>

              {/* Specifications */}
              <div className={styles.specsBlock}>
                <h2 className={styles.blockTitle}>Specifications</h2>
                <div className={styles.specsGrid}>
                  {[
                    ['Material',   product.material],
                    ['Dimensions', product.dimensions],
                    ['Weight',     product.weight],
                    ['Finish',     product.finish],
                    ['Color',      product.color],
                    ['Origin',     product.origin],
                    ['Lead Time',  product.leadTime],
                    ['Warranty',   product.warranty],
                  ]
                    .filter(([, val]) => val)
                    .map(([label, val]) => (
                      <div key={label} className={styles.specItem}>
                        <span className={styles.specLabel}>{label}</span>
                        <span className={styles.specValue}>{val}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Product Details */}
              {product.details && (
                <div className={styles.detailsBlock}>
                  <h2 className={styles.blockTitle}>Product Details</h2>
                  <p className={styles.detailsText}>{product.details}</p>
                </div>
              )}

              {/* Care Instructions */}
              {product.care?.length > 0 && (
                <div className={styles.careBlock}>
                  <h2 className={styles.blockTitle}>Care & Maintenance</h2>
                  <ul className={styles.careList}>
                    {product.care.map((tip, i) => (
                      <li key={i} className={styles.careItem}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Row attached inside scrolling zone or right below */}
              <div className={styles.ctaRow}>
                <a href="#contact" className={styles.inquireBtn} onClick={onClose}>
                  Inquire About This Piece
                </a>
                <button
                  className={styles.shareBtn}
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                >
                  Share
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Related Products ─────────────────────── */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

/* ── Related Card ────────────────────────────── */
const RelatedCard = ({ product, onSelect }) => (
  <div
    className={styles.relatedCard}
    onClick={() => onSelect(product)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect(product)}
  >
    <div className={styles.relatedImgWrap}>
      <img
        src={product.images?.[0] || product.image}
        alt={product.name}
        className={styles.relatedImg}
      />
      <div className={styles.relatedOverlay}>
        <span className={styles.relatedViewBtn}>View Details</span>
      </div>
    </div>
    <div className={styles.relatedBody}>
      <span className={styles.relatedCategory}>{product.category}</span>
      <h3 className={styles.relatedName}>{product.name}</h3>
      {product.price && <p className={styles.relatedPrice}>{product.price}</p>}
    </div>
  </div>
);

export default ProductDetail;
import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductDetail.module.css';
import ContactSection from '../ContactSection/ContactSection';

// 🌟 Read live inventory via the new 'allProducts' prop assignment
const ProductDetail = ({ product, allProducts, onClose, onSelectProduct }) => {
  const [activeImg, setActiveImg] = useState(0);
  const contactRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => { 
    setActiveImg(0); 
    if (overlayRef.current) {
      overlayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Handle image fallbacks safely between database object configurations
  const fallbackImage = product.image_url || product.image;
  const images = product.images?.length ? product.images : [fallbackImage];

  // Related items check handles cloud database objects gracefully
  const related = (allProducts || [])
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* ✨ KEY TRICK: Passing product.id as a 'key' to the page element 
          forces React to re-trigger the CSS fade-in animation safely 
          every single time the product changes.
      */}
      <div className={styles.page} key={product.id}>

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
              {images[activeImg] || fallbackImage ? (
                <img
                  key={activeImg}
                  src={images[activeImg] || fallbackImage}
                  alt={`${product.name} view ${activeImg + 1}`}
                  className={styles.mainImg}
                  loading="eager"
                  decoding="async"
                  width={product.imageWidth}
                  height={product.imageHeight}
                />
              ) : (
                <div className={styles.noImagePlaceholder}>No Image Available</div>
              )}
              {product.tag && <span className={styles.tag}>{product.tag}</span>}
            </div>
            
            {!product.inStock && <span className={styles.outOfStockBadge}>Out of Stock</span>}
            
            {images.length > 1 && images[0] !== undefined && (
              <div className={styles.thumbRow}>
                {images.map((src, idx) => {
                  if (!src) return null;
                  return (
                    <button
                      key={idx}
                      className={`${styles.thumb} ${idx === activeImg ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(idx)}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img 
                        src={src} 
                        alt="" 
                        className={styles.thumbImg} 
                        width="72" 
                        height="72" 
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className={styles.info}>
            <div className={styles.stickyHeader}>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.name}>{product.name}</h1>
              {product.price && <p className={styles.price}>{product.price}</p>}
            </div>

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

              {/* CTA Row */}
              <div className={styles.ctaRow}>
                <a href="#contact" className={styles.inquireBtn} onClick={scrollToContact}>
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

      <div ref={contactRef} className={styles.bottomContactBlock}>
        <ContactSection />
      </div>

    </div>
  );
};

/* ── Related Card ── */
const RelatedCard = ({ product, onSelect }) => {
  const cardImg = product.image_url || product.images?.[0] || product.image;

  return (
    <button
      className={styles.relatedCard}
      onClick={() => onSelect(product)}
      type="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className={styles.relatedImgWrap}>
        <img
          src={cardImg}
          alt={product.name}
          className={styles.relatedImg}
          width={product.imageWidth}
          height={product.imageHeight}
          loading="lazy"
          decoding="async"
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
    </button>
  );
};

export default ProductDetail;
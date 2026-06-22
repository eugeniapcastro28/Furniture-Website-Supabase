import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductDetail.module.css';
import ContactSection from '../ContactSection/ContactSection';

// Add this helper at the top of ProductDetail.jsx
const optimizeImage = (url, width = 800, quality = 75) => {
  if (!url || !url.includes('supabase')) return url;
  return `${url}?width=${width}&quality=${quality}&format=webp`;
};

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

  // 🌟 MULTI-IMAGE RESOLUTION LAYER
  const images = Array.isArray(product.image_url)
    ? product.image_url
    : product.image_url 
    ? [product.image_url]
    : product.images?.length 
    ? product.images 
    : [product.image];

  const fallbackImage = images[0] || '';

  // 🌟 SAFE STOCK STATUS RESOLUTION
  const isOutOfStock = product.in_stock === false || product.inStock === false;

  // 🌟 ROBUST RELATED ITEMS LAYER (Matches seamlessly via 'category')
  const fallbackRelated = React.useMemo(() => {
    const pool = allProducts || [];
    if (!product) return [];

    const currentId = String(product.id);
    const currentCategory = String(product.category || '').toLowerCase().trim();

    // 1. Filter items belonging to the exact same category
    let matches = pool.filter(p => {
      const itemCategory = String(p.category || '').toLowerCase().trim();
      const itemId = String(p.id);
      return itemCategory === currentCategory && itemId !== currentId;
    });

    // 2. Safe Fallback: If no other items share this category, display alternative options from pool
    if (matches.length === 0) {
      matches = pool.filter(p => String(p.id) !== currentId);
    }

    return matches.slice(0, 3);
  }, [allProducts, product]);

  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={overlayRef} className={styles.overlay}>
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
                  src={optimizeImage(images[activeImg] || fallbackImage, 800, 80)}
                  alt={`${product.name} view ${activeImg + 1}`}
                  className={`${styles.mainImg} ${isOutOfStock ? styles.outOfStockImgDim : ''}`}
                  loading="eager"
                  decoding="async"
                  width={product.imageWidth}
                  height={product.imageHeight}
                />
              ) : (
                <div className={styles.noImagePlaceholder}>No Image Available</div>
              )}
              {product.tag && <span className={styles.tag}>{product.tag}</span>}
              
              {/* POSITIONED OUT OF STOCK BADGE */}
              {isOutOfStock && (
                <span className={styles.outOfStockBadge}>
                  Temporarily Out of Stock
                </span>
              )}
            </div>
            
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
                        src={optimizeImage(src, 150, 60)}
                        alt=""
                        className={styles.thumbImg}
                        loading="lazy"
                        decoding="async"
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
              {product.price && (
                <p className={styles.price}>
                  ₱{typeof product.price === 'number' ? product.price.toLocaleString() : product.price.replace('₱', '')}
                </p>
              )}
            </div>

            <div className={styles.scrollableContent}>
              <p className={styles.desc}>{product.description}</p>

              {/* Specifications */}
              <div className={styles.specsBlock}>
                <h2 className={styles.blockTitle}>Specifications</h2>
                <div className={styles.specsGrid}>
                  {[
                    ['Availability', isOutOfStock ? 'Temporarily Out of Stock' : 'Available / Made to Order'],
                    ['Material',     product.material],
                    ['Dimensions',   product.dimensions],
                    ['Weight',       product.weight],
                    ['Finish',       product.finish],
                    ['Color',        product.color],
                    ['Origin',       product.origin],
                    ['Lead Time',    product.lead_time || product.leadTime],
                    ['Warranty',     product.warranty],
                  ]
                    .filter(([, val]) => val)
                    .map(([label, val]) => (
                      <div key={label} className={styles.specItem}>
                        <span className={styles.specLabel}>{label}</span>
                        <span className={`${styles.specValue} ${label === 'Availability' && isOutOfStock ? styles.outOfStockText : ''}`}>
                          {val}
                        </span>
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
                <a 
                  href="#contact" 
                  className={`${styles.inquireBtn} ${isOutOfStock ? styles.outOfStockBtn : ''}`} 
                  onClick={scrollToContact}
                >
                  {isOutOfStock ? 'Inquire for Next Batch / Restock' : 'Inquire About This Piece'}
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

        {/* ── Related Products Row (Mapped to standard Category values) ── */}
        {fallbackRelated.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
            <div className={styles.relatedGrid}>
              {fallbackRelated.map(p => (
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
  // Resolve image source dynamically
  const cardImg = Array.isArray(product.image_url) 
    ? product.image_url[0] 
    : product.image_url || product.images?.[0] || product.image;

  return (
    <button
      className={styles.relatedCard}
      onClick={() => onSelect(product)}
      type="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className={styles.relatedImgWrap}>
        {cardImg ? (
          <img
            src={optimizeImage(cardImg, 400, 70)}
            alt={product.name}
            className={styles.relatedImg}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.noImagePlaceholderMini}>No Image</div>
        )}
        <div className={styles.relatedOverlay}>
          <span className={styles.relatedViewBtn}>View Details</span>
        </div>
      </div>
      
      <div className={styles.relatedBody}>
        <span className={styles.relatedCategory}>{product.category}</span>
        <h3 className={styles.relatedName}>{product.name}</h3>
        {product.price && (
          <p className={styles.relatedPrice}>
            ₱{typeof product.price === 'number' 
              ? product.price.toLocaleString() 
              : product.price.replace('₱', '')}
          </p>
        )}
      </div>
    </button>
  );
};

export default ProductDetail;
import React from 'react';
import styles from './AdminDashboard.module.css';
import { HiPencil, HiTrash } from 'react-icons/hi';

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Resolve display image from string, array, or comma-separated
  const displayImage = Array.isArray(product.image_url)
    ? product.image_url[0]
    : typeof product.image_url === 'string' && product.image_url.includes(',')
      ? product.image_url.split(',')[0].trim()
      : product.image_url;

  const isOutOfStock = product.in_stock === false || product.inStock === false;

  const categoryLabel = product.category === 'decor & lighting'
    ? 'Decor & Lighting'
    : product.category
      ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
      : 'Uncategorized';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={displayImage || 'https://via.placeholder.com/400'}
          alt={product.name}
          className={styles.cardImg}
          onError={e => { e.target.src = 'https://via.placeholder.com/400'; }}
        />

        {isOutOfStock && (
          <span className={styles.outOfStockBadge}>Out of Stock</span>
        )}

        <div className={styles.adminActionsOverlay}>
          <button className={styles.editActionBtn} onClick={() => onEdit(product)}>
            <HiPencil /> Edit
          </button>
          <button className={styles.deleteActionBtn} onClick={() => onDelete(product.id, product.image_url)}>
            <HiTrash /> Delete
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>{categoryLabel} Collection</span>
        <h3 className={styles.cardName}>{product.name}</h3>
        <p className={styles.cardDesc}>{product.description}</p>
        <div className={styles.cardMeta}>
          <span className={styles.cardMaterial}>{product.material || 'Natural Blend'}</span>
          <span className={styles.cardPrice}>₱{product.price?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
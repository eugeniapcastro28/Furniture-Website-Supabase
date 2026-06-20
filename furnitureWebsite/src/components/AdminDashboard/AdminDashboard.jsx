import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import HeroManager from './HeroManager';
import styles from './AdminDashboard.module.css';
import { HiPlus } from 'react-icons/hi';
import { categories } from '../../data/products';
import CategoryManager from './CategoryManager';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showToast('Failed to load inventory: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const openCreateModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const openEditModal = (product) => { setEditingProduct(product); setIsModalOpen(true); };

  const handleDelete = async (id, imageUrl) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      if (imageUrl) {
        const urls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
        for (const url of urls) {
          const parts = url.split('/storage/v1/object/public/product-images/');
          if (parts.length > 1) await supabase.storage.from('product-images').remove([parts[1]]);
        }
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product removed from inventory.');
    } catch (err) {
      showToast('Deletion error: ' + err.message, 'error');
    }
  };

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p =>
        (p.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase()
      );

  const available  = filteredProducts.filter(p => p.in_stock !== false && p.inStock !== false);
  const outOfStock = filteredProducts.filter(p => p.in_stock === false || p.inStock === false);

  return (
    <div className={styles.adminContainer}>

      {/* ── Products Header ── */}
      <div className={styles.adminHeader}>
        <div>
          <span className={styles.eyebrow}>Management Panel</span>
          <h2 className={styles.title}>Storefront Inventory</h2>
          <p className={styles.subtitle}>Manage, update, and publish showroom listings.</p>
        </div>
        <button className={styles.addBtn} onClick={openCreateModal}>
          <HiPlus /> Add New Item
        </button>
      </div>

      {/* ── Category Filters ── */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.filterActive : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
          <span className={styles.filterCount}>{products.length}</span>
        </button>
        {categories.map(cat => {
          const count = products.filter(p =>
            (p.category || '').trim().toLowerCase() === cat.id.trim().toLowerCase()
          ).length;
          return (
            <button
              key={cat.id}
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <div className={styles.loader}>Loading inventory...</div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>
          {activeCategory === 'all'
            ? 'No products in the showroom yet.'
            : `No products in the "${activeCategory}" category.`}
        </div>
      ) : (
        <>
          {available.length > 0 && (
            <div className={styles.stockSection}>
              <h3 className={styles.stockTitle}>
                Active Showroom
                <span className={styles.stockCount}>{available.length}</span>
              </h3>
              <div className={styles.grid}>
                {available.map(p => (
                  <ProductCard key={p.id} product={p} onEdit={openEditModal} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {outOfStock.length > 0 && (
            <div className={styles.outOfStockSection}>
              <h3 className={`${styles.stockTitle} ${styles.stockTitleMuted}`}>
                Out of Stock
                <span className={`${styles.stockCount} ${styles.stockCountMuted}`}>{outOfStock.length}</span>
              </h3>
              <div className={styles.grid}>
                {outOfStock.map(p => (
                  <ProductCard key={p.id} product={p} onEdit={openEditModal} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Hero Slideshow Manager ── */}
      <HeroManager onToast={showToast} />
      <CategoryManager onToast={showToast} />

      {/* ── Product Modal ── */}
      {isModalOpen && (
        <ProductModal
          key={editingProduct ? editingProduct.id : 'new'}
          isOpen={isModalOpen}
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchInventory}
          showToast={showToast}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={styles.toastContainer}>
          <div className={`${styles.toastBox} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
            <div className={styles.toastHeader}>
              <span className={styles.toastTitle}>
                <span className={styles.toastIcon}>
                  {toast.type === 'error' ? '✕' : '✓'}
                </span>
                {toast.type === 'error' ? 'Error Encountered' : 'Action Complete'}
              </span>
              <button type="button" className={styles.toastCloseBtn} onClick={() => setToast(null)}>×</button>
            </div>
            <p className={styles.toastMessage}>{toast.message}</p>
            <div className={styles.toastProgressTrack}>
              <div className={styles.toastProgressBar} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
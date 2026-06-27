import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import HeroManager from './HeroManager';
import CategoryManager from './CategoryManager';
import styles from './AdminDashboard.module.css';
import { HiPlus, HiCollection, HiPhotograph, HiTag, HiViewGrid, HiArrowLeft } from 'react-icons/hi';

const TABS = [
  { id: 'inventory',  label: 'Inventory',   icon: HiViewGrid   },
  { id: 'hero',       label: 'Hero Slides',  icon: HiPhotograph },
  { id: 'categories', label: 'Categories',   icon: HiTag        },
];

const TAB_META = {
  inventory:  { eyebrow: 'Storefront',  title: 'Inventory'   },
  hero:       { eyebrow: 'Homepage',    title: 'Hero Slides'  },
  categories: { eyebrow: 'Homepage',    title: 'Categories'   },
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab]           = useState('inventory');
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast]                   = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbCategories, setDbCategories]     = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showToast('Failed to load inventory: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDbCategories = async () => {
    const { data } = await supabase
      .from('categories').select('slug, label').order('sort_order', { ascending: true });
    if (data) setDbCategories(data);
  };

  useEffect(() => { fetchInventory(); fetchDbCategories(); }, []);

  const openCreateModal = () => { setEditingProduct(null); setIsModalOpen(true); };
  const openEditModal   = (p) => { setEditingProduct(p);   setIsModalOpen(true); };

  const handleDelete = async (id, imageUrl) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      if (imageUrl) {
        const urls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
        for (const url of urls) {
          const parts = url.split('/storage/v1/object/public/product-images/');
          if (parts.length > 1)
            await supabase.storage.from('product-images').remove([parts[1]]);
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

  const meta = TAB_META[activeTab];

  return (
    <div className={styles.adminContainer}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandMark}>A</span>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Artisan</span>
            <span className={styles.brandSub}>Admin Panel</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <span className={styles.navLabel}>Manage</span>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className={styles.tabIcon} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" className={styles.sidebarBackLink}>
            <HiArrowLeft /> Back to Showroom
          </a>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className={styles.mainArea}>

        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.pageEyebrow}>{meta.eyebrow}</span>
            <h1 className={styles.pageTitle}>{meta.title}</h1>
          </div>
          <div className={styles.topBarRight}>
            {activeTab === 'inventory' && (
              <button className={styles.primaryBtn} onClick={openCreateModal}>
                <HiPlus /> New Product
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className={styles.tabContent}>

          {/* INVENTORY */}
          {activeTab === 'inventory' && (
            <>
              <div className={styles.filterStrip}>
                <button
                  className={`${styles.chip} ${activeCategory === 'all' ? styles.chipActive : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All <span className={styles.chipCount}>{products.length}</span>
                </button>
                {dbCategories.map(cat => {
                  const count = products.filter(p =>
                    (p.category || '').trim().toLowerCase() === cat.slug.trim().toLowerCase()
                  ).length;
                  return (
                    <button
                      key={cat.slug}
                      className={`${styles.chip} ${activeCategory === cat.slug ? styles.chipActive : ''}`}
                      onClick={() => setActiveCategory(cat.slug)}
                    >
                      {cat.label}
                      <span className={styles.chipCount}>{count}</span>
                    </button>
                  );
                })}
              </div>

              {loading ? (
                <div className={styles.loader}>
                  <span className={styles.loaderDot} />
                  <span className={styles.loaderDot} />
                  <span className={styles.loaderDot} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  <HiCollection className={styles.emptyIcon} />
                  <p>{activeCategory === 'all' ? 'No products yet. Add your first item.' : `No products in "${activeCategory}".`}</p>
                </div>
              ) : (
                <>
                  {available.length > 0 && (
                    <section className={styles.stockSection}>
                      <div className={styles.sectionLabel}>
                        <span>Active Listings</span>
                        <span className={styles.sectionCount}>{available.length}</span>
                      </div>
                      <div className={styles.grid}>
                        {available.map(p => (
                          <ProductCard key={p.id} product={p} onEdit={openEditModal} onDelete={handleDelete} />
                        ))}
                      </div>
                    </section>
                  )}
                  {outOfStock.length > 0 && (
                    <section className={styles.outSection}>
                      <div className={`${styles.sectionLabel} ${styles.sectionLabelMuted}`}>
                        <span>Out of Stock</span>
                        <span className={`${styles.sectionCount} ${styles.sectionCountMuted}`}>{outOfStock.length}</span>
                      </div>
                      <div className={styles.grid}>
                        {outOfStock.map(p => (
                          <ProductCard key={p.id} product={p} onEdit={openEditModal} onDelete={handleDelete} />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'hero'       && <HeroManager onToast={showToast} />}
          {activeTab === 'categories' && <CategoryManager onToast={showToast} />}

        </div>
      </div>

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
                <span className={styles.toastIcon}>{toast.type === 'error' ? '✕' : '✓'}</span>
                {toast.type === 'error' ? 'Error' : 'Done'}
              </span>
              <button className={styles.toastClose} onClick={() => setToast(null)}>×</button>
            </div>
            <p className={styles.toastMsg}>{toast.message}</p>
            <div className={styles.toastTrack}><div className={styles.toastBar} /></div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
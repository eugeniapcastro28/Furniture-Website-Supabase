import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './HeroManager.module.css';
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import CategoryModal from './CategoryModal';

const CategoryManager = ({ onToast }) => {
  const [cats, setCats]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setCats(data || []);
    } catch (err) {
      onToast('Failed to load categories: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id, imageUrl) => {
  try {
    // ✅ Check if any products are using this category
    const catToDelete = cats.find(c => c.id === id);
    if (catToDelete) {
      const { count, error: countError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category', catToDelete.slug);

      if (countError) throw countError;

      if (count > 0) {
        onToast(
          `Cannot delete "${catToDelete.label}" — it has ${count} product${count > 1 ? 's' : ''} linked to it. Reassign or remove them first.`,
          'error'
        );
        return; // ❌ Block deletion entirely
      }
    }

    // ✅ Safe to delete
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;

    if (imageUrl) {
      const parts = imageUrl.split('/storage/v1/object/public/category-images/');
      if (parts.length > 1)
        await supabase.storage.from('category-images').remove([parts[1]]);
    }

    setCats(prev => prev.filter(c => c.id !== id));
    onToast('Category removed.');
  } catch (err) {
    onToast('Delete failed: ' + err.message, 'error');
  }
};

  const openCreate = ()    => { setEditingCategory(null); setIsModalOpen(true); };
  const openEdit   = (cat) => { setEditingCategory(cat);  setIsModalOpen(true); };

  return (
    <div>
      {/* Tab-level action bar */}
      <div className={styles.tabActionBar}>
        <p className={styles.tabDesc}>Manage the category cards shown in the homepage browse section.</p>
        <button className={styles.addBtn} onClick={openCreate}>
          <HiPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading categories…</div>
      ) : cats.length === 0 ? (
        <div className={styles.emptyState}>
          <HiPhotograph className={styles.emptyIcon} />
          <p>No categories yet. Add one to get started.</p>
        </div>
      ) : (
        <div className={styles.slideGrid}>
          {cats.map((cat, i) => (
            <div key={cat.id} className={styles.slideCard}>
              <div className={styles.slideImageWrap}>
                <img
                  src={cat.image_url}
                  alt={cat.label}
                  className={styles.slideImg}
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x220'; }}
                />
                <span className={styles.slideOrder}>#{i + 1}</span>
                <div className={styles.slideOverlay}>
                  <button className={styles.editBtn} onClick={() => openEdit(cat)}>
                    <HiPencil /> Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(cat.id, cat.image_url)}>
                    <HiTrash /> Remove
                  </button>
                </div>
              </div>
              <div className={styles.slideInfo}>
                <span className={styles.slideName}>{cat.label}</span>
                <span className={styles.slideMeta}>slug: {cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CategoryModal
          key={editingCategory ? editingCategory.id : 'new-category'}
          isOpen={isModalOpen}
          category={editingCategory}
          categoryCount={cats.length}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchCategories}
          onToast={onToast}
        />
      )}
    </div>
  );
};

export default CategoryManager;
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './HeroModal.module.css'; // Reusing the same modal styling
import { HiX, HiUpload, HiEye } from 'react-icons/hi';

const CategoryModal = ({ isOpen, category, categoryCount, onClose, onRefresh, onToast }) => {
  const [slug, setSlug] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (category) {
      setSlug(category.slug || '');
      setLabel(category.label || '');
      setDescription(category.description || '');
      setSortOrder(category.sort_order ?? 0);
      setPreviewUrl(category.image_url || '');
    } else {
      setSlug(''); setLabel(''); setDescription('');
      setSortOrder(categoryCount); setPreviewUrl(''); setImageFile(null);
    }
  }, [category, isOpen, categoryCount]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'image/webp' && !file.name.endsWith('.webp')) {
      onToast('Please upload a .webp image for best performance.', 'error');
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!previewUrl && !imageFile) {
      onToast('An image is required for the category.', 'error');
      return;
    }

    if (!slug.trim()) {
      onToast('Please enter a slug (must match the category value used on products).', 'error');
      return;
    }

    try {
      setUploading(true);
      let finalImageUrl = category?.image_url || '';

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `categories/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('category-images').getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }

      const payload = {
        slug: slug.trim().toLowerCase(),
        label,
        description,
        image_url: finalImageUrl,
        sort_order: parseInt(sortOrder, 10) || 0,
      };

      if (category?.id) {
        const { error } = await supabase.from('categories').update(payload).eq('id', category.id);
        if (error) throw error;
        onToast('Category updated.');
      } else {
        const { error } = await supabase.from('categories').insert([payload]);
        if (error) throw error;
        onToast('New category added.');
      }

      onRefresh();
      onClose();
    } catch (err) {
      onToast('Save failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Left: Live Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewLabel}>
            <HiEye /> Category Preview
          </div>
          <div className={styles.previewCard}>
            <div className={styles.previewImageWrap}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className={styles.previewImg} />
              ) : (
                <div className={styles.previewEmpty}>
                  <HiUpload className={styles.previewEmptyIcon} />
                  <span>Upload an image to preview</span>
                </div>
              )}
              <div className={styles.previewOverlay} />
              <div className={styles.previewContent}>
                <span className={styles.previewEyebrow}>Browse</span>
                <h3 className={styles.previewTitle}>{label || 'Category Label'}</h3>
                <p className={styles.previewDesc}>{description || 'Category description will appear here...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className={styles.formPanel}>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <HiX />
          </button>

          <form id="categoryForm" onSubmit={handleSave} className={styles.form}>
            <div className={styles.formTitle}>
              <h3>{category ? 'Edit Category' : 'New Category'}</h3>
              <p>
                {category
                  ? "Update this category's content and image."
                  : 'Add a new category card to the homepage categories section.'}
              </p>
            </div>

            <h4 className={styles.sectionHeader}>Category Image</h4>
            <label className={styles.uploadZone}>
              <HiUpload className={styles.uploadIcon} />
              <div>
                <span>{imageFile ? imageFile.name : 'Click to upload category image'}</span>
                <small>.webp format recommended</small>
              </div>
              <input type="file" accept="image/webp,image/*" onChange={handleImageChange} className={styles.hiddenInput} />
            </label>

            <h4 className={styles.sectionHeader}>Category Content</h4>
            <div className={styles.inputGroup}>
              <label>Slug (must match Product category value)</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
                placeholder="e.g. rattan"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Display Label</label>
              <input type="text" value={label} onChange={e => setLabel(e.target.value)} required placeholder="e.g. Rattan Furniture" />
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief category description shown on hover..." />
            </div>

            <div className={styles.inputGroup}>
              <label>Display Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                min="0"
                placeholder="e.g. 0"
              />
            </div>

            <div style={{ height: 16 }} />
          </form>

          <div className={styles.submitBar}>
            <button type="submit" form="categoryForm" disabled={uploading} className={styles.submitBtn}>
              {uploading ? 'Saving...' : category ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
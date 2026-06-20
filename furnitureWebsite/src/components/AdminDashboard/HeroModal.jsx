import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './HeroModal.module.css';
import { HiX, HiUpload, HiEye } from 'react-icons/hi';

const HeroModal = ({ isOpen, slide, slideCount, onClose, onRefresh, onToast }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // 🌟 Added state to keep track of total count and taken display orders
  const [existingSlidesCount, setExistingSlidesCount] = useState(0);
  const [takenSortOrders, setTakenSortOrders] = useState([]);

  // 🌟 Fetch real-time database totals and sorting numbers when opened
  useEffect(() => {
    const fetchHeroConstraints = async () => {
      if (!isOpen) return;

      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('id, sort_order');

        if (error) throw error;

        if (data) {
          setExistingSlidesCount(data.length);
          const orders = data.map(s => parseInt(s.sort_order, 10));
          setTakenSortOrders(orders);
        }
      } catch (err) {
        console.error('Error validation syncing:', err.message);
      }
    };

    fetchHeroConstraints();
  }, [isOpen, slide]);

  useEffect(() => {
    if (!isOpen) return;
    if (slide) {
      setName(slide.name || '');
      setDescription(slide.description || '');
      setMaterial(slide.material || '');
      setDimensions(slide.dimensions || '');
      setSortOrder(slide.sort_order ?? 0);
      setPreviewUrl(slide.image_url || '');
    } else {
      setName(''); setDescription(''); setMaterial('');
      setDimensions(''); setSortOrder(slideCount);
      setPreviewUrl(''); setImageFile(null);
    }
  }, [slide, isOpen, slideCount]);

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

  // 🌟 Real-time display order handling matching your ProductModal style
  const handleSortOrderChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setSortOrder('');
      return;
    }

    const intValue = parseInt(value, 10);
    setSortOrder(intValue); // Keep the typed value in state so the user can see it...

    // ...but warn them immediately if it's a duplicate
    const isAssignedToMe = slide && slide.sort_order === intValue;
    if (takenSortOrders.includes(intValue) && !isAssignedToMe) {
      onToast(`Warning: Display number ${intValue} is already assigned to another hero slide.`, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!previewUrl && !imageFile) {
      onToast('An image is required for the hero slide.', 'error');
      return;
    }

    // Rule 1: Guard limit to maximum of 10 slides (Only for creating new records)
    if (!slide?.id && existingSlidesCount >= 10) {
      onToast('Cannot add slide. The hero section is strictly limited to 10 records maximum.', 'error');
      return;
    }

    // Rule 2: Strict Empty Check
    if (sortOrder === '' || sortOrder === null || isNaN(sortOrder)) {
      onToast('Please enter a valid display order number.', 'error');
      return;
    }

    const finalSortOrder = parseInt(sortOrder, 10);
    const isAssignedToMe = slide && slide.sort_order === finalSortOrder;

    // CRITICAL FIX: Explicitly 'return' out of handleSave if a duplicate is caught on submit!
    if (takenSortOrders.includes(finalSortOrder) && !isAssignedToMe) {
      onToast(`Save rejected: Display order ${finalSortOrder} is currently in use. Please select a different number.`, 'error');
      return; // ❌ This completely blocks the Supabase upload pipeline from executing
    }

    try {
      setUploading(true);
      let finalImageUrl = slide?.image_url || '';

      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `slides/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('hero-images').getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }

      const payload = { 
        name, 
        description, 
        material, 
        dimensions, 
        image_url: finalImageUrl, 
        sort_order: finalSortOrder 
      };

      if (slide?.id) {
        const { error } = await supabase.from('hero_slides').update(payload).eq('id', slide.id);
        if (error) throw error;
        onToast('Hero slide updated.');
      } else {
        const { error } = await supabase.from('hero_slides').insert([payload]);
        if (error) throw error;
        onToast('New hero slide added.');
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
            <HiEye /> Hero Preview
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
                <span className={styles.previewEyebrow}>Handcrafted in the Philippines</span>
                {/* Fallback evaluation to empty string if numeric order cleared */}
                <h3 className={styles.previewTitle}>
                  {name || 'Slide Title'} {sortOrder !== '' && `(#${sortOrder})`}
                </h3>
                <p className={styles.previewDesc}>{description || 'Slide description will appear here...'}</p>
                <div className={styles.previewMeta}>
                  {material && <span><strong>Material</strong>{material}</span>}
                  {dimensions && <span><strong>Size</strong>{dimensions}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className={styles.formPanel}>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <HiX />
          </button>

          <form id="heroSlideForm" onSubmit={handleSave} className={styles.form}>
            <div className={styles.formTitle}>
              <h3>{slide ? 'Edit Slide' : 'New Hero Slide'}</h3>
              <p>
                {slide 
                  ? "Update this slide's content and image." 
                  : `Add a new slide to the homepage hero (${existingSlidesCount}/10 slides used).`
                }
              </p>
            </div>

            <h4 className={styles.sectionHeader}>Slide Image</h4>
            <label className={styles.uploadZone}>
              <HiUpload className={styles.uploadIcon} />
              <div>
                <span>{imageFile ? imageFile.name : 'Click to upload hero image'}</span>
                <small>.webp format recommended</small>
              </div>
              <input type="file" accept="image/webp,image/*" onChange={handleImageChange} className={styles.hiddenInput} />
            </label>

            <h4 className={styles.sectionHeader}>Slide Content</h4>
            <div className={styles.inputGroup}>
              <label>Product / Slide Title</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rattan Sala Set" />
            </div>

            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief product description shown on the hero..." />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Material</label>
                <input type="text" value={material} onChange={e => setMaterial(e.target.value)} placeholder="e.g. Natural Rattan & Abaca" />
              </div>
              <div className={styles.inputGroup}>
                <label>Dimensions</label>
                <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="e.g. 160W × 75D × 85H cm" />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Display Order</label>
              <input 
                type="number" 
                value={sortOrder} 
                onChange={handleSortOrderChange} 
                min="1" 
                required
                placeholder="e.g. 2" 
              />
            </div>

            <div style={{ height: 16 }} />
          </form>

          <div className={styles.submitBar}>
            <button type="submit" form="heroSlideForm" disabled={uploading} className={styles.submitBtn}>
              {uploading ? 'Saving...' : slide ? 'Save Changes' : 'Add to Slideshow'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroModal;
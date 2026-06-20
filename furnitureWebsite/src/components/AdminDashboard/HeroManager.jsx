import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './HeroManager.module.css';
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from 'react-icons/hi';
import HeroModal from './HeroModal';

const HeroManager = ({ onToast }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      onToast('Failed to load hero slides: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleDelete = async (id, imageUrl) => {
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;

      if (imageUrl) {
        const parts = imageUrl.split('/storage/v1/object/public/hero-images/');
        if (parts.length > 1) await supabase.storage.from('hero-images').remove([parts[1]]);
      }

      setSlides(prev => prev.filter(s => s.id !== id));
      onToast('Hero slide removed.');
    } catch (err) {
      onToast('Delete failed: ' + err.message, 'error');
    }
  };

  const openCreate = () => { setEditingSlide(null); setIsModalOpen(true); };
  const openEdit = (slide) => { setEditingSlide(slide); setIsModalOpen(true); };

  return (
    <div className={styles.heroManagerSection}>
      <div className={styles.heroManagerHeader}>
        <div>
          <span className={styles.eyebrow}>Hero Section</span>
          <h3 className={styles.sectionTitle}>Homepage Slideshow</h3>
          <p className={styles.sectionSubtitle}>Manage the rotating hero images shown on the homepage.</p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <HiPlus /> Add Slide
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Loading slides...</div>
      ) : slides.length === 0 ? (
        <div className={styles.emptyState}>
          <HiPhotograph className={styles.emptyIcon} />
          <p>No hero slides yet. Add one to get started.</p>
        </div>
      ) : (
        <div className={styles.slideGrid}>
          {slides.map((slide, i) => (
            <div key={slide.id} className={styles.slideCard}>
              <div className={styles.slideImageWrap}>
                <img
                  src={slide.image_url}
                  alt={slide.name}
                  className={styles.slideImg}
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x220'; }}
                />
                <span className={styles.slideOrder}>#{i + 1}</span>
                <div className={styles.slideOverlay}>
                  <button className={styles.editBtn} onClick={() => openEdit(slide)}>
                    <HiPencil /> Edit
                  </button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(slide.id, slide.image_url)}>
                    <HiTrash /> Remove
                  </button>
                </div>
              </div>
              <div className={styles.slideInfo}>
                <span className={styles.slideName}>{slide.name}</span>
                <span className={styles.slideMaterial}>{slide.material}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <HeroModal
          key={editingSlide ? editingSlide.id : 'new-slide'}
          isOpen={isModalOpen}
          slide={editingSlide}
          slideCount={slides.length}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchSlides}
          onToast={onToast}
        />
      )}
    </div>
  );
};

export default HeroManager;
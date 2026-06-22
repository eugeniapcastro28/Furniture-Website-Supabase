import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './ProductModal.module.css';
import { HiX, HiUpload, HiEye, HiSparkles } from 'react-icons/hi';

const resizeImageBeforeUpload = (file, maxWidth = 1400, maxHeight = 1800) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // ✅ Cap both width AND height
      const scale = Math.min(1, maxWidth / img.width, maxHeight / img.height);
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        resolve(new File([blob], file.name, { type: 'image/webp' }));
        URL.revokeObjectURL(url);
      }, 'image/webp', 0.85);
    };
    img.src = url;
  });
};

// 🌟 Added 'takenDisplayOrders' prop (expecting an array of numbers like [1, 3, 4])
const ProductModal = ({ isOpen, product, onClose, onRefresh, showToast = [] }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('seating');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [imageQueue, setImageQueue] = useState([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(''); // 🌟 Initialized as empty string
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [finish, setFinish] = useState('');
  const [color, setColor] = useState('');
  const [origin, setOrigin] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [warranty, setWarranty] = useState('');
  const [details, setDetails] = useState('');
  const [careList, setCareList] = useState([]);
  const [currentCareInput, setCurrentCareInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [takenDisplayOrders, setTakenDisplayOrders] = useState([]);
  const [categories, setCategories] = useState([]); // 👈 add here

// ✅ Move this useEffect up too, before the `if (!visible) return null` line
useEffect(() => {
  const fetchCategories = async () => {
    if (!isOpen) return;
    const { data, error } = await supabase
      .from('categories')
      .select('slug, label')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      setCategories(data);
      if (!product) setCategory(data[0].slug);
    }
  };
  fetchCategories();
}, [isOpen]);

  // Handle open/close visibility
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 280);
  };

  useEffect(() => {
    const fetchTakenOrders = async () => {
      if (!isOpen) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('display_order')
          .eq('featured', true)
          .not('display_order', 'is', null);

        if (error) throw error;

        if (data) {
          // Parse values safely to integers
          const orders = data.map(p => parseInt(p.display_order, 10));
          setTakenDisplayOrders(orders);
        }
      } catch (err) {
        console.error('Error fetching sequence numbers:', err.message);
      }
    };

    fetchTakenOrders();
  }, [isOpen, product]);

  // Populate form fields when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setDescription(product.description || '');
      setPrice(product.price || '');
      setMaterial(product.material || '');
      setDimensions(product.dimensions || '');
      setWeight(product.weight || '');
      setFinish(product.finish || '');
      setColor(product.color || '');
      setOrigin(product.origin || '');
      setLeadTime(product.lead_time || product.leadTime || '');
      setWarranty(product.warranty || '');
      setDetails(product.details || '');
      setCareList(Array.isArray(product.care) ? product.care : []);

      const featuredVal = product.featured ?? product.isFeatured;
      const parsedFeatured = featuredVal != null ? Boolean(featuredVal) : true;
      setIsFeatured(parsedFeatured);

      // 🌟 Map Existing Order: Ensure it only maps if featured is true
      if (parsedFeatured && product.display_order !== undefined && product.display_order !== null) {
        setDisplayOrder(String(product.display_order));
      } else {
        setDisplayOrder('');
      }

      if (Array.isArray(product.image_url)) {
        setImageQueue(product.image_url.map((url, idx) => ({
          id: `existing-${idx}-${Date.now()}`,
          file: null, previewUrl: url, isExisting: true
        })));
      } else if (product.image_url) {
        setImageQueue([{ id: 'existing-0', file: null, previewUrl: product.image_url, isExisting: true }]);
      } else {
        setImageQueue([]);
      }

      const stockVal = product.in_stock ?? product.inStock;
      setInStock(stockVal != null ? Boolean(stockVal) : true);
    } else {
      setName(''); setCategory(''); setDescription(''); setPrice('');
      setMaterial(''); setDimensions(''); setWeight(''); setFinish('');
      setColor(''); setOrigin(''); setLeadTime(''); setWarranty('');
      setDetails(''); setCareList([]); setImageQueue([]);
      setInStock(true); setIsFeatured(true); setDisplayOrder(''); // 🌟 Reset to empty
    }

    setActivePreviewIndex(0);
    setCurrentCareInput('');
  }, [product, isOpen]);

  if (!visible) return null;

  // 🌟 Handle Order Number Real-time Changes & Validation
  const handleDisplayOrderChange = (e) => {
    const value = e.target.value;
    
    // Allow clearing the input completely
    if (value === '') {
      setDisplayOrder('');
      return;
    }

    const intValue = parseInt(value, 10);

    // 1. Strict limit constraint: 1 to 7
    if (intValue < 1 || intValue > 7) {
      showToast('Only sequence numbers from 1 to 7 are allowed.', 'error');
      return;
    }

    // 2. Uniqueness Validation against external list
    // Exclude the current product's own existing order number during edits
    const isCurrentlyAssignedToMe = product && product.display_order === intValue;
    if (takenDisplayOrders.includes(intValue) && !isCurrentlyAssignedToMe) {
      showToast(`Sequence number ${intValue} is already assigned to another featured product.`, 'error');
      return;
    }

    setDisplayOrder(value);
  };

  // 🌟 Handle Feature Toggle Lifecycle Constraints
  const handleFeaturedToggle = (checked) => {
    setIsFeatured(checked);
    if (!checked) {
      setDisplayOrder(''); // Clear number completely if dropped from homepage collection
    }
  };

  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const valid = files.reduce((acc, file) => {
      if (file.type !== 'image/webp' && !file.name.endsWith('.webp')) {
        showToast(`"${file.name}" is invalid. Please upload .webp images only.`, 'error');
        return acc;
      }
      acc.push({
        id: `local-${Math.random().toString(36).substring(7)}-${Date.now()}`,
        file, previewUrl: URL.createObjectURL(file), isExisting: false
      });
      return acc;
    }, []);

    setImageQueue(prev => [...prev, ...valid]);
  };

  const handleRemoveImageFromQueue = (idx) => {
    const item = imageQueue[idx];
    if (!item.isExisting && item.previewUrl.startsWith('blob:')) URL.revokeObjectURL(item.previewUrl);
    const updated = imageQueue.filter((_, i) => i !== idx);
    setImageQueue(updated);
    if (activePreviewIndex >= updated.length) setActivePreviewIndex(Math.max(0, updated.length - 1));
  };
 
  const handleDragStart = (i) => { dragItem.current = i; };
  const handleDragEnter = (i) => { dragOverItem.current = i; };
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const copy = [...imageQueue];
    const dragged = copy.splice(dragItem.current, 1)[0];
    copy.splice(dragOverItem.current, 0, dragged);

    if (activePreviewIndex === dragItem.current) setActivePreviewIndex(dragOverItem.current);
    else if (activePreviewIndex === dragOverItem.current) setActivePreviewIndex(dragItem.current);

    dragItem.current = null;
    dragOverItem.current = null;
    setImageQueue(copy);
  };

  const handleAddCareTip = () => {
    if (!currentCareInput.trim()) return;
    setCareList(prev => [...prev, currentCareInput.trim()]);
    setCurrentCareInput('');
  };

  const handleRemoveCareTip = (idx) => setCareList(prev => prev.filter((_, i) => i !== idx));

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!imageQueue.length) {
      showToast('At least one image is required.', 'error');
      return;
    }
  

    // Final safety check before pushing payload to database
    if (isFeatured && !displayOrder) {
      showToast('Please specify a display sequence order number for featured items.', 'error');
      return;
    }

    try {
      setUploading(true);
      const finalizedUrls = [];

      for (const item of imageQueue) {
  if (item.isExisting) {
    finalizedUrls.push(item.previewUrl);
    continue;
  }
  const resized = await resizeImageBeforeUpload(item.file); // 👈 resize before upload
  const path = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
  const { error: uploadError } = await supabase.storage
    .from('product-images').upload(path, resized);
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  finalizedUrls.push(data.publicUrl);
}

      const payload = {
        name, category, description, price: parseFloat(price), material,
        image_url: finalizedUrls, dimensions, weight, finish, color, origin,
        lead_time: leadTime, warranty, details, care: careList,
        in_stock: Boolean(inStock), featured: Boolean(isFeatured),
        // 🌟 If item isn't featured, store it as NULL (or 0 depending on your DB preference)
        display_order: isFeatured ? (parseInt(displayOrder, 10) || null) : null 
      };

      if (product?.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      onRefresh();
      handleClose();
      showToast(product?.id ? 'Product updated successfully.' : 'Product published to showroom.');

    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${closing ? styles.modalOverlayClosing : ''}`}>
      <div className={`${styles.largeModalContent} ${closing ? styles.modalContentClosing : ''}`}>

        {/* LEFT: Preview Panel */}
        <div className={styles.previewPanel}>
          <div className={styles.previewStickyWrap}>
            <div className={styles.previewHeaderLabel}>
              <HiEye className={styles.labelIcon} /> Live Showroom Preview
            </div>

            <div className={styles.simulatedCard}>
              <div className={styles.simulatedImageWrap}>
                {imageQueue.length > 0 ? (
                  <img src={imageQueue[activePreviewIndex]?.previewUrl} alt="Preview" className={styles.simulatedImg} />
                ) : (
                  <div className={styles.emptyPreviewPlaceholder}>
                    <HiUpload className={styles.placeholderCloudIcon} />
                    <span>Upload photos to see live view</span>
                  </div>
                )}
                {!inStock && <span className={styles.simulatedOutTag}>Out of Stock</span>}
                {isFeatured
                  ? <span className={styles.simulatedTag}>Homepage Collection</span>
                  : <span className={styles.simulatedHiddenTag}>Products Page Only</span>
                }
              </div>

              {imageQueue.length > 1 && (
                <div className={styles.previewDotsIndicator}>
                  {imageQueue.map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.previewDot} ${i === activePreviewIndex ? styles.activeDot : ''}`}
                      onClick={() => setActivePreviewIndex(i)}
                    />
                  ))}
                </div>
              )}

              <div className={styles.simulatedCardBody}>
                <span className={styles.simulatedCategory}>{category} Collection</span>
                <h3 className={styles.simulatedName}>{name || 'Artisan Furniture Item Name'}</h3>
                <p className={styles.simulatedDesc}>{description || 'Introductory summary description text...'}</p>
                <div className={styles.simulatedMeta}>
                  <span>{material || 'Material Construct'}</span>
                  <strong>₱{price ? Number(price).toLocaleString() : '0.00'}</strong>
                </div>
              </div>
            </div>

            <div className={styles.formatTipBox}>
              <HiSparkles className={styles.tipIcon} />
              <p>Toggle availability settings below to see showroom layout changes live.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Panel */}
        <div className={styles.formPanel}>
          <button className={styles.closeModalBtn} onClick={handleClose} type="button" aria-label="Close">
            <HiX />
          </button>

          <form id="productForm" onSubmit={handleSaveProduct} className={styles.modalForm}>
            <div className={styles.formTitle}>
              <h3>{product ? 'Edit Product' : 'New Product'}</h3>
              <p>{product ? 'Update specifications for this listing.' : 'Fill in the details to publish to the showroom.'}</p>
            </div>

            <h4 className={styles.sectionHeader}>Media Gallery</h4>
            <div className={styles.inputGroup}>
              <label className={styles.customUploadZone}>
                <HiUpload className={styles.uploadZoneIcon} />
                <div className={styles.uploadZoneTexts}>
                  <span>Click to upload showroom photos</span>
                  <small>.webp format only · multiple allowed</small>
                </div>
                <input type="file" accept="image/webp" multiple onChange={handleMultipleImageChange} className={styles.hiddenFileInput} />
              </label>
            </div>

            {imageQueue.length > 0 && (
              <div className={styles.formGalleryGrid}>
                {imageQueue.map((img, i) => (
                  <div
                    key={img.id}
                    className={`${styles.galleryThumbContainer} ${i === activePreviewIndex ? styles.activeThumbBorder : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragEnter={() => handleDragEnter(i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => e.preventDefault()}
                    style={{ cursor: 'grab' }}
                  >
                    <img src={img.previewUrl} alt="Thumb" className={styles.galleryThumbImg} onClick={() => setActivePreviewIndex(i)} />
                    <button type="button" className={styles.removeThumbBtn} onClick={() => handleRemoveImageFromQueue(i)}>
                      <HiX />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h4 className={styles.sectionHeader}>Primary Details</h4>
            <div className={styles.inputGroup}>
              <label>Item Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Rattan Sala Chair" />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Loading categories...</option>
                  )}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Price (PHP)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="38500" />
              </div>
            </div>

            <h4 className={styles.sectionHeader}>Technical Specs</h4>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Material</label>
                <input type="text" value={material} onChange={e => setMaterial(e.target.value)} required placeholder="e.g. Solid Oak Wood" />
              </div>
              <div className={styles.inputGroup}>
                <label>Dimensions</label>
                <input type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} placeholder="75cm H × 180cm W × 90cm D" />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Weight</label>
                <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 15 kg" />
              </div>
              <div className={styles.inputGroup}>
                <label>Surface Finish</label>
                <input type="text" value={finish} onChange={e => setFinish(e.target.value)} placeholder="e.g. Matte Polyurethane" />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Color</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g. Natural Honey Amber" />
              </div>
              <div className={styles.inputGroup}>
                <label>Country of Origin</label>
                <input type="text" value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Philippines" />
              </div>
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>Lead Time</label>
                <input type="text" value={leadTime} onChange={e => setLeadTime(e.target.value)} placeholder="e.g. 2–3 Weeks" />
              </div>
              <div className={styles.inputGroup}>
                <label>Warranty</label>
                <input type="text" value={warranty} onChange={e => setWarranty(e.target.value)} placeholder="e.g. 1-Year Structural" />
              </div>
            </div>

            <h4 className={styles.sectionHeader}>Description & Details</h4>
            <div className={styles.inputGroup}>
              <label>Short Description</label>
              <textarea rows="2" value={description} onChange={e => setDescription(e.target.value)} required placeholder="Brief introductory summary..." />
            </div>
            <div className={styles.inputGroup}>
              <label>Extended Details</label>
              <textarea rows="3" value={details} onChange={e => setDetails(e.target.value)} placeholder="Structural highlights, features..." />
            </div>

            <h4 className={styles.sectionHeader}>Care & Maintenance</h4>
            <div className={styles.careSection}>
              <div className={styles.careInputRow}>
                <input
                  type="text"
                  value={currentCareInput}
                  onChange={e => setCurrentCareInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCareTip())}
                  placeholder="e.g. Wipe with a soft dry cloth"
                  className={styles.careInput}
                />
                <button type="button" onClick={handleAddCareTip} className={styles.careAddBtn}>Add</button>
              </div>

              {careList.length > 0 && (
                <ul className={styles.careBadgeList}>
                  {careList.map((tip, idx) => (
                    <li key={idx} className={styles.careBadgeItem}>
                      <span className={styles.careBadgeDot} />
                      <span className={styles.careBadgeText}>{tip}</span>
                      <button type="button" onClick={() => handleRemoveCareTip(idx)} className={styles.careBadgeRemove}>
                        <HiX />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {careList.length === 0 && (
                <p className={styles.careEmptyHint}>No tips added yet — press Enter or click Add.</p>
              )}
            </div>

            <h4 className={styles.sectionHeader}>Showroom Placement</h4>
            <div className={styles.managementControlWrapper}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Item Availability</strong>
                  <p>Off shows an "Out of Stock" notice on the listing.</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong>Feature on Homepage</strong>
                  <p>Displays this item in the main showcase gallery.</p>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={isFeatured} onChange={e => handleFeaturedToggle(e.target.checked)} />
                  <span className={styles.slider} />
                </label>
              </div>

              {/* 🌟 Sequencer row conditional wrapper */}
              {isFeatured && (
                <div className={styles.toggleRow} style={{ paddingTop: 10 }}>
                  <div className={styles.toggleInfo}>
                    <strong>Display Sequence Order Number</strong>
                    <p>Lower order numbers show up first (e.g., 1, 2, 3).</p>
                  </div>
                  <div className={styles.inputGroup} style={{ width: 80 }}>
                    <input 
                      type="number" 
                      value={displayOrder} 
                      onChange={handleDisplayOrderChange} 
                      min="1"
                      max="7"
                      placeholder="-"
                      style={{ textAlign: 'center', padding: '6px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ height: 16 }} />
          </form>

          <div className={styles.formActionsRow}>
            <button type="submit" form="productForm" disabled={uploading} className={styles.submitBtn}>
              {uploading ? 'Uploading...' : product ? 'Save Changes' : 'Publish to Showroom'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
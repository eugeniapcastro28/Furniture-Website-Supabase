import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseClient';
import styles from './AdminDashboard.module.css'; 
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Field States
  const [editingId, setEditingId] = useState(null); 
  const [name, setName] = useState('');
  const [category, setCategory] = useState('seating');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🌟 NEW: Extra Specification Fields Mapped directly to your Database Schema
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [finish, setFinish] = useState('');
  const [color, setColor] = useState('');
  const [origin, setOrigin] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [warranty, setWarranty] = useState('');
  const [details, setDetails] = useState('');
  
  // Array management for Care & Maintenance steps
  const [careList, setCareList] = useState([]);
  const [currentCareInput, setCurrentCareInput] = useState('');

  // 1. Fetch live inventory items on load
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
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 2. Open Modal handler for Creating vs Editing (Updated to capture all new inputs)
  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setCategory(product.category);
      setDescription(product.description || '');
      setPrice(product.price || '');
      setMaterial(product.material || '');
      
      // Load specification column details
      setDimensions(product.dimensions || '');
      setWeight(product.weight || '');
      setFinish(product.finish || '');
      setColor(product.color || '');
      setOrigin(product.origin || '');
      setLeadTime(product.lead_time || product.leadTime || '');
      setWarranty(product.warranty || '');
      setDetails(product.details || '');
      setCareList(Array.isArray(product.care) ? product.care : []);
    } else {
      setEditingId(null);
      setName('');
      setCategory('seating');
      setDescription('');
      setPrice('');
      setMaterial('');
      setDimensions('');
      setWeight('');
      setFinish('');
      setColor('');
      setOrigin('');
      setLeadTime('');
      setWarranty('');
      setDetails('');
      setCareList([]);
    }
    setCurrentCareInput('');
    setImageFile(null);
    setIsModalOpen(true);
  };

  // 3. Delete handling function
  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to permanently delete this masterpiece from inventory?')) return;

    try {
      const { error: dbError } = await supabase.from('products').delete().eq('id', id);
      if (dbError) throw dbError;

      if (imageUrl) {
        const urlParts = imageUrl.split('/storage/v1/object/public/product-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from('product-images').remove([filePath]);
        }
      }

      alert('Product successfully removed.');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Deletion error: ' + err.message);
    }
  };

  // 4. Care Array List Actions
  const handleAddCareTip = () => {
    if (currentCareInput.trim()) {
      setCareList([...careList, currentCareInput.trim()]);
      setCurrentCareInput('');
    }
  };

  const handleRemoveCareTip = (indexToRemove) => {
    setCareList(careList.filter((_, idx) => idx !== indexToRemove));
  };

  // 5. Save Form Submission (Handles rich spec payload data)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      
      let finalImageUrl = null;
      if (editingId) {
        const match = products.find(p => p.id === editingId);
        if (match) {
          finalImageUrl = match.image_url; 
        }
      }

      if (imageFile) {
        if (imageFile.type !== 'image/webp' && !imageFile.name.endsWith('.webp')) {
          alert('Invalid file format! Please upload your furniture images strictly in high-performance .webp format.');
          setUploading(false);
          return;  
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl; 
      }

      if (!finalImageUrl) {
        throw new Error('An image file selection is mandatory to showcase this product.');
      }

      // Rich schema payload constructed with your new details
      const payload = {
        name,
        category,
        description,
        price: parseFloat(price),
        material,
        image_url: finalImageUrl,
        dimensions,
        weight,
        finish,
        color,
        origin,
        lead_time: leadTime, // Database column maps to snake_case
        warranty,
        details,
        care: careList
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
        alert('Product details updated perfectly!');
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);
        if (insertError) throw insertError;
        alert('New product launched successfully!');
      }

      setIsModalOpen(false);
      fetchInventory();
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <div>
          <span className={styles.eyebrow}>Management Panel</span>
          <h2 className={styles.title}>Storefront Inventory Control</h2>
          <p className={styles.subtitle}>Modify, append, or purge public display listings instantly.</p>
        </div>
        <button className={styles.addBtn} onClick={() => openModal(null)}>
          <HiPlus /> Add New Item
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>Synchronizing backend systems...</div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img src={product.image_url} alt={product.name} className={styles.cardImg} />
                <div className={styles.adminActionsOverlay}>
                  <button className={styles.editActionBtn} onClick={() => openModal(product)}>
                    <HiPencil /> Edit
                  </button>
                  <button className={styles.deleteActionBtn} onClick={() => handleDelete(product.id, product.image_url)}>
                    <HiTrash /> Delete
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardCategory}>
                {product.category === 'decor & lighting' ? 'Decor & Lighting' : product.category.charAt(0).toUpperCase() + product.category.slice(1)} Collection
                </span>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.cardDesc}>{product.description}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.cardMaterial}>{product.material || 'Natural Blend'}</span>
                  <span className={styles.cardPrice}>₱{product.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🌟 SLICK MODAL DISPLAY FORM */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingId ? 'Modify Product Specifications' : 'Introduce New Furniture Entry'}</h3>
              <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>
                <HiX />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className={styles.modalForm}>
              {/* ── Section 1: Basic Info ── */}
              <h4 className={styles.sectionHeader}>Primary Parameters</h4>
              
              <div className={styles.inputGroup}>
                <label>Furniture Item Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Rattan Sala Chair" />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Category Group</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="seating">Seating</option>
                    <option value="tables">Tables</option>
                    <option value="storage">Storage</option>
                    <option value="beds">Beds</option>
                    <option value="decor & lighting">Decor & Lighting</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label>Price Amount (PHP)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="38500" />
                </div>
              </div>

              {/* ── Section 2: Technical Specifications ── */}
              <h4 className={styles.sectionHeader}>Technical Product Specification Dimensions</h4>
              
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Material Construct</label>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} required placeholder="e.g. Solid Oak Wood" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Dimensions</label>
                  <input type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="e.g. 75cm H x 180cm W x 90cm D" />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Weight Capacity / Mass</label>
                  <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 14 kg" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Surface Finish / Coating</label>
                  <input type="text" value={finish} onChange={(e) => setFinish(e.target.value)} placeholder="e.g. Matte Polyurethane Protective Layer" />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Color Setup</label>
                  <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Light Honey Oak" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Country Origin</label>
                  <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Pampanga, Philippines" />
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Production Lead Time</label>
                  <input type="text" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="e.g. 3 - 4 weeks custom order" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Warranty Range</label>
                  <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} placeholder="e.g. 1-Year Structural Coverage" />
                </div>
              </div>

              {/* ── Section 3: Descriptive Details ── */}
              <h4 className={styles.sectionHeader}>Rich Narrative Copy blocks</h4>

              <div className={styles.inputGroup}>
                <label>Brief Portfolio Hook/Description</label>
                <textarea rows="2" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Provide a quick introductory summary..."></textarea>
              </div>

              <div className={styles.inputGroup}>
                <label>Extended Product Structural Details</label>
                <textarea rows="3" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Explain the historical joinery styles, texture profile variables..."></textarea>
              </div>

              {/* ── Section 4: Array Care Elements ── */}
              <h4 className={styles.sectionHeader}>Care & Maintenance Instructions</h4>
              <div className={styles.inputGroup}>
                <label>Add Care Tip</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={currentCareInput} 
                    onChange={(e) => setCurrentCareInput(e.target.value)} 
                    placeholder="e.g. Wipe with clean lint-free damp cloth cloth." 
                  />
                  <button type="button" onClick={handleAddCareTip} style={{ padding: '0 16px', background: '#222', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Add
                  </button>
                </div>
                
                {/* Visual List Container displaying staging entries before sending */}
                {careList.length > 0 && (
                  <ul style={{ marginTop: '10px', paddingLeft: '20px', fontSize: '0.9rem' }}>
                    {careList.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>
                        <span style={{ marginRight: '10px' }}>{tip}</span>
                        <button type="button" onClick={() => handleRemoveCareTip(idx)} style={{ background: 'none', border: 'none', color: '#e05656', cursor: 'pointer', fontSize: '0.8rem' }}>
                          (Remove)
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ── Section 5: Assets ── */}
              <h4 className={styles.sectionHeader}>Media Assets</h4>
              <div className={styles.inputGroup}>
                <label>Display Imagery File {editingId && <span style={{color: '#c3a26f'}}>(Leave empty to preserve current)</span>}</label>
                <input 
                    type="file" 
                    accept="image/webp" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    required={!editingId} 
                />
              </div>

              <button type="submit" disabled={uploading} className={styles.submitBtn}>
                {uploading ? 'Processing Data Pipeline...' : editingId ? 'Update Specifications' : 'Publish to Showroom'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
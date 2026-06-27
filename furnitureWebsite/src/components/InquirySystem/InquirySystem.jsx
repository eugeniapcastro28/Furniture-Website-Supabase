// ============================================================
// InquirySystem.jsx
// Drop this file into: src/components/InquirySystem/
// Install deps first:
//   npm install jspdf jspdf-autotable emailjs-com
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import emailjs from 'emailjs-com';
import styles from './InquirySystem.module.css';
import { HiShoppingBag, HiX, HiDownload, HiMail, HiChat, HiPlus, HiMinus } from 'react-icons/hi';

// ── CONFIG — fill these in once you have your EmailJS keys ──
const EMAILJS_SERVICE_ID  = 'service_u050kfb';   // e.g. 'epanganiban_service'
const EMAILJS_TEMPLATE_ID = 'template_3cwv9jm';  // e.g. 'inquiry_template'
const EMAILJS_PUBLIC_KEY  = 'EVcPhi4nUuUjWkBSE';   // from EmailJS Account > General

const SHOP = {
  name:    'E. Panganiban Bamboo and Furniture Shop',
  phone:   '09208485411',
  email:   'eugeniapcastro28@gmail.com',
  address: 'National Hi-Way Brgy.Parian Calamba City, Laguna 4027',
  fb:      'https://www.facebook.com/RBCbahaykubo',
  fbName:  'RBC Bamboo Furniture and Bahay-kubo Maker',
  fbUsername: 'RBCbahaykubo',
};

// ── Helper: generate reference number ──
const genRef = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `EPB-${y}${m}${d}-${rand}`;
};

// ── Helper: format price ──
const formatPrice = (p) => {
  if (!p) return '—';
  const n = typeof p === 'number' ? p : parseFloat(String(p).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? String(p) : `₱${n.toLocaleString()}`;
};

// ═══════════════════════════════════════════════════════════
// PDF GENERATOR
// ═══════════════════════════════════════════════════════════
const generatePDF = async (items, customer, refNum, logoDataUrl) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const dateStr = new Date().toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // ── Background ──
  doc.setFillColor(246, 245, 241);
  doc.rect(0, 0, W, 297, 'F');

  // ── Header band ──
  doc.setFillColor(26, 21, 16);
  doc.rect(0, 0, W, 38, 'F');

  // ── Gold accent line ──
  doc.setFillColor(195, 162, 111);
  doc.rect(0, 38, W, 1.5, 'F');

  // ── Logo ──
  if (logoDataUrl) {
   try { doc.addImage(logoDataUrl, 'PNG', 10, 5, 28, 28); } catch (_) {}
}

  // ── Shop name in header ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(SHOP.name, 44, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(195, 162, 111);
  doc.text(`${SHOP.address}  ·  ${SHOP.phone}  ·  ${SHOP.email}`, 44, 25);

  // ── INQUIRY FORM title ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(195, 162, 111);
  doc.text('PRODUCT INQUIRY FORM', 44, 33);

  // ── Reference + Date block ──
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 46, W - 20, 22, 2, 2, 'F');
  doc.setDrawColor(225, 218, 203);
  doc.setLineWidth(0.3);
  doc.roundedRect(10, 46, W - 20, 22, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(170, 170, 170);
  doc.text('REFERENCE NUMBER', 16, 53);
  doc.text('DATE', W / 2 + 4, 53);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(107, 80, 39);
  doc.text(refNum, 16, 61);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(58, 46, 30);
  doc.text(dateStr, W / 2 + 4, 61);

  // ── Customer Details ──
  let y = 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 80, 39);
  doc.text('CUSTOMER DETAILS', 10, y);
  doc.setFillColor(195, 162, 111);
  doc.rect(10, y + 1.5, 35, 0.5, 'F');

  y += 8;
  const customerFields = [
    ['Full Name',          customer.name],
    ['Contact Number',     customer.contact],
    ['Preferred Contact',  customer.preferred],
    ['Notes / Requests',   customer.notes || '—'],
  ];

  customerFields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text(label.toUpperCase(), 10, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);

    const lines = doc.splitTextToSize(value, W / 2 - 20);
    doc.text(lines, 10, y + 5);
    y += 5 + (lines.length * 4.5) + 3;
  });

  // ── Items Table ──
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 80, 39);
  doc.text('ITEMS INQUIRED', 10, y);
  doc.setFillColor(195, 162, 111);
  doc.rect(10, y + 1.5, 32, 0.5, 'F');
  y += 7;

  // Table header
  const colX = [10, 80, 130, 170];
  const headers = ['Product Name', 'Category', 'Price', 'Status'];

  doc.setFillColor(26, 21, 16);
  doc.rect(10, y, W - 20, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(195, 162, 111);
  headers.forEach((h, i) => doc.text(h, colX[i] + 2, y + 5.2));
  y += 8;

  // Table rows
  items.forEach((item, idx) => {
    const rowH = 10;
    const bg = idx % 2 === 0 ? [255, 255, 255] : [250, 247, 242];
    doc.setFillColor(...bg);
    doc.rect(10, y, W - 20, rowH, 'F');

    doc.setDrawColor(236, 232, 224);
    doc.setLineWidth(0.2);
    doc.line(10, y + rowH, W - 10, y + rowH);

    const isOOS = item.in_stock === false || item.inStock === false;
    const nameLines = doc.splitTextToSize(item.name || 'Unnamed Product', 65);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 30, 30);
    doc.text(nameLines, colX[0] + 2, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text(item.category || '—', colX[1] + 2, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(107, 80, 39);
    doc.text(formatPrice(item.price), colX[2] + 2, y + 4);

    // Status badge
    if (isOOS) {
      doc.setFillColor(220, 53, 69);
      doc.roundedRect(colX[3] + 2, y + 1.5, 26, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text('RESTOCK INQUIRY', colX[3] + 4, y + 5.3);
    } else {
      doc.setFillColor(195, 162, 111);
      doc.roundedRect(colX[3] + 2, y + 1.5, 20, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text('AVAILABLE', colX[3] + 4.5, y + 5.3);
    }

    y += rowH;
  });

  // ── Footer ──
  const footerY = 272;
  doc.setFillColor(26, 21, 16);
  doc.rect(0, footerY, W, 25, 'F');
  doc.setFillColor(195, 162, 111);
  doc.rect(0, footerY, W, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(195, 162, 111);
  doc.text('HOW TO SEND YOUR INQUIRY', W / 2, footerY + 7, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `Send this PDF via Facebook Messenger: ${SHOP.fbName}  ·  or Email: ${SHOP.email}  ·  or Call/SMS: ${SHOP.phone}`,
    W / 2, footerY + 13, { align: 'center' }
  );

  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Please keep your Reference Number ${refNum} for follow-up.`,
    W / 2, footerY + 19, { align: 'center' }
  );

  return doc;
};

// ═══════════════════════════════════════════════════════════
// INQUIRY BASKET CONTEXT — export and wrap your App with this
// ═══════════════════════════════════════════════════════════
export const InquiryContext = React.createContext(null);

export const InquiryProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  const addItem = (product) => {
    setBasket(prev => {
      if (prev.find(p => String(p.id) === String(product.id))) return prev;
      return [...prev, product];
    });
  };

  const removeItem = (id) => {
    setBasket(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const clearBasket = () => setBasket([]);

  const isInBasket = (id) => basket.some(p => String(p.id) === String(id));

  return (
    <InquiryContext.Provider value={{ basket, addItem, removeItem, clearBasket, isInBasket }}>
      {children}
    </InquiryContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════
// ADD TO INQUIRY BUTTON — use this on ProductCard & ProductDetail
// ═══════════════════════════════════════════════════════════
export const AddToInquiryBtn = ({ product, className }) => {
  const { addItem, removeItem, isInBasket } = React.useContext(InquiryContext);
  const added = isInBasket(product?.id);
  const isOOS = product?.in_stock === false || product?.inStock === false;

  const label = added
    ? 'Added ✓'
    : isOOS
    ? 'Inquire Restock'
    : 'Add to Inquiry';

  return (
    <button
      className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''} ${isOOS ? styles.addBtnOOS : ''} ${className || ''}`}
      onClick={(e) => {
        e.stopPropagation();
        added ? removeItem(product.id) : addItem(product);
      }}
    >
      {label}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════
// FLOATING BASKET BUTTON + FULL INQUIRY PANEL
// ═══════════════════════════════════════════════════════════
export const InquiryBasket = () => {
  const { basket, removeItem, clearBasket } = React.useContext(InquiryContext);
  const [open, setOpen]       = useState(false);
  const [step, setStep]       = useState('basket'); // 'basket' | 'form' | 'sent'
  const [sending, setSending] = useState(false);
  const [refNum]              = useState(genRef);
  const logoRef               = useRef(null);

  const [form, setForm] = useState({
    name: '', contact: '', preferred: 'Messenger', notes: ''
  });

  // Preload logo as base64
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/LOGO.webp';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      logoRef.current = canvas.toDataURL('image/png');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    setSending(true);

    const itemsList = basket.map((item, i) => {
      const isOOS = item.in_stock === false || item.inStock === false;
      return `${i + 1}. ${item.name} (${item.category || 'N/A'}) — ${formatPrice(item.price)} [${isOOS ? 'RESTOCK INQUIRY' : 'AVAILABLE'}]`;
    }).join('\n');

    // 1. Send email via EmailJS
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          reference_number: refNum,
          customer_name:    form.name,
          customer_contact: form.contact,
          preferred_contact: form.preferred,
          customer_notes:   form.notes || 'None',
          items_list:       itemsList,
          date:             new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }),
          item_count:       basket.length,
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (err) {
      console.error('EmailJS error:', err);
      // Continue even if email fails — PDF still downloads
    }

    // 2. Generate + download PDF
    try {
      const pdf = await generatePDF(basket, form, refNum, logoRef.current);
      pdf.save(`Inquiry_${refNum}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    }

    setSending(false);
    setStep('sent');
  };

  const messengerUrl = `https://m.me/${SHOP.fbUsername}?text=${encodeURIComponent(
  `Hi! I'd like to inquire about my order. Reference: ${refNum}. Please see attached PDF.`
)}`;

  if (basket.length === 0 && !open) return null;

  return (
    <>
      {/* Floating button */}
      <button className={styles.floatBtn} onClick={() => setOpen(true)} aria-label="Open inquiry basket">
        <HiShoppingBag className={styles.floatIcon} />
        {basket.length > 0 && (
          <span className={styles.floatBadge}>{basket.length}</span>
        )}
      </button>

      {/* Panel overlay */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.panel} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.panelTitle}>
                  {step === 'sent' ? 'Inquiry Sent!' : 'My Inquiry List'}
                </h2>
                <p className={styles.panelSub}>
                  {step === 'basket' && `${basket.length} item${basket.length !== 1 ? 's' : ''} selected`}
                  {step === 'form'   && 'Fill in your details'}
                  {step === 'sent'   && `Reference: ${refNum}`}
                </p>
              </div>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>
                <HiX />
              </button>
            </div>

            {/* ── STEP: BASKET ── */}
            {step === 'basket' && (
              <>
                <div className={styles.itemsList}>
                  {basket.length === 0 ? (
                    <div className={styles.emptyBasket}>
                      <HiShoppingBag className={styles.emptyIcon} />
                      <p>No items added yet</p>
                    </div>
                  ) : basket.map(item => {
                    const isOOS = item.in_stock === false || item.inStock === false;
                    const img = Array.isArray(item.image_url) ? item.image_url[0] : item.image_url || item.image;
                    return (
                      <div key={item.id} className={styles.basketItem}>
                        <div className={styles.basketThumb}>
                          {img ? <img src={img} alt={item.name} className={styles.basketImg} /> : <div className={styles.noImg} />}
                        </div>
                        <div className={styles.basketInfo}>
                          <span className={styles.basketCat}>{item.category}</span>
                          <span className={styles.basketName}>{item.name}</span>
                          <span className={styles.basketPrice}>{formatPrice(item.price)}</span>
                          {isOOS && <span className={styles.oosTag}>Restock Inquiry</span>}
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                          <HiX />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {basket.length > 0 && (
                  <div className={styles.panelFooter}>
                    <button className={styles.clearBtn} onClick={clearBasket}>Clear All</button>
                    <button className={styles.proceedBtn} onClick={() => setStep('form')}>
                      Proceed to Inquiry →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── STEP: FORM ── */}
            {step === 'form' && (
              <form onSubmit={handleSubmit} className={styles.inquiryForm}>
                <div className={styles.formScroll}>
                  {/* Summary */}
                  <div className={styles.formSummary}>
                    <span className={styles.formSummaryLabel}>Items in inquiry</span>
                    {basket.map(item => (
                      <div key={item.id} className={styles.formSummaryItem}>
                        <span>— {item.name}</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Full Name <span>*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Santos"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Contact Number <span>*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09XX XXX XXXX"
                      value={form.contact}
                      onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Preferred Contact Method</label>
                    <select
                      value={form.preferred}
                      onChange={e => setForm(f => ({ ...f, preferred: e.target.value }))}
                    >
                      <option>Messenger</option>
                      <option>Call</option>
                      <option>SMS</option>
                      <option>Email</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Notes / Special Requests</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Custom color, delivery address, questions..."
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <div className={styles.panelFooter}>
                  <button type="button" className={styles.clearBtn} onClick={() => setStep('basket')}>
                    ← Back
                  </button>
                  <button type="submit" className={styles.proceedBtn} disabled={sending}>
                    {sending ? 'Sending...' : 'Submit & Download PDF'}
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP: SENT ── */}
            {step === 'sent' && (
              <div className={styles.sentScreen}>
                <div className={styles.sentIcon}>✓</div>
                <h3 className={styles.sentTitle}>Inquiry Submitted!</h3>
                <p className={styles.sentDesc}>
                  Your inquiry has been sent to our email and your PDF has been downloaded.
                  Please also send the PDF to us via Messenger for faster response.
                </p>
                <p className={styles.sentRef}>Reference: <strong>{refNum}</strong></p>

                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.messengerBtn}
                >
                  <HiChat className={styles.messengerIcon} />
                  Send via Messenger
                </a>

                <button
                  className={styles.doneBtn}
                  onClick={() => {
                    clearBasket();
                    setOpen(false);
                    setStep('basket');
                  }}
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default InquiryBasket;
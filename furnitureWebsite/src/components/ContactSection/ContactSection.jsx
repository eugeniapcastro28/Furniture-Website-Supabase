import React from 'react';
import styles from './ContactSection.module.css';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import logo from '../../assets/logoWhite.png';

const contactInfo = [
  { 
    icon: HiPhone, 
    label: 'Phone', 
    value: '+63 912 345 6789', 
    link: 'tel:+639123456789' 
  },
  { 
    icon: HiMail, 
    label: 'Email', 
    value: 'info@epanganiban.com', 
    link: 'mailto:info@epanganiban.com' 
  },
  { 
    icon: HiLocationMarker, 
    label: 'Location', 
    value: 'Calamba, Laguna, Philippines', 
    // Dynamically encoded URL for Google Maps search
    link: 'https://www.google.com/maps/search/?api=1&query=E.+Panganiban+Bamboo+and+Furniture+Shop+Calamba+Laguna' 
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        
        {/* Brand Col */}
        <div className={styles.brandCol}>
          <img src={logo} alt="E. Panganiban" className={styles.footerLogo} />
          <p className={styles.brandName}>E. Panganiban Bamboo & Furniture Shop</p>
          <p className={styles.tagline}>Handcrafted with love in the Philippines</p>
        </div> 

        {/* Contact Info */}
        <div className={styles.contactCol}>
          <span className={styles.eyebrow}>Get in Touch</span>
          <h2 className={styles.title}>Interested in a Piece?</h2>
          <p className={styles.body}>
            We welcome inquiries and custom orders. Reach out to us and our team
            will be happy to assist you in finding the perfect furniture for your home.
          </p>

          <div className={styles.contactItems}>
            {contactInfo.map(({ icon: Icon, label, value, link }) => (
              <div key={label} className={styles.contactItem}>
                <span className={styles.contactIcon}><Icon /></span>
                <div>
                  <span className={styles.contactLabel}>{label}</span>
                  {/* Render as a clickable link if a link property exists */}
                  {link ? (
                    <a 
                      href={link} 
                      className={styles.contactValueLink}
                      target={label === 'Location' ? '_blank' : '_self'} 
                      rel="noopener noreferrer"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className={styles.contactValue}>{value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} E. Panganiban Bamboo & Furniture Shop. All rights reserved.</span>
      </div>
    </section>
  );
};

export default ContactSection;
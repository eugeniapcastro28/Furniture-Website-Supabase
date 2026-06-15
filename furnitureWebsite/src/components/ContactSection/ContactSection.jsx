import React from 'react';
import styles from './ContactSection.module.css';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import logo from '../../assets/logoWhite.png';

const contactInfo = [
  { icon: HiPhone, label: 'Phone', value: '+63 912 345 6789' },
  { icon: HiMail, label: 'Email', value: 'info@epanganiban.com' },
  { icon: HiLocationMarker, label: 'Location', value: 'Batangas, Philippines' },
];

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#categories', label: 'Categories' },
  { href: '#about', label: 'About' },
];

const ContactSection = () => {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        {/* Contact Info */}
        <div className={styles.contactCol}>
          <span className={styles.eyebrow}>Get in Touch</span>
          <h2 className={styles.title}>Interested in a Piece?</h2>
          <p className={styles.body}>
            We welcome inquiries and custom orders. Reach out to us and our team
            will be happy to assist you in finding the perfect furniture for your home.
          </p>

          <div className={styles.contactItems}>
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className={styles.contactItem}>
                <span className={styles.contactIcon}><Icon /></span>
                <div>
                  <span className={styles.contactLabel}>{label}</span>
                  <span className={styles.contactValue}>{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Brand + Links */}
        <div className={styles.brandCol}>
          <img src={logo} alt="E. Panganiban" className={styles.footerLogo} />
          <p className={styles.brandName}>E. Panganiban Bamboo & Furniture Shop</p>
          <p className={styles.tagline}>Handcrafted with love in the Philippines</p>

          <nav className={styles.footerNav}>
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} className={styles.footerLink}>{label}</a>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.copyright}>
        <span>© {new Date().getFullYear()} E. Panganiban Bamboo & Furniture Shop. All rights reserved.</span>
      </div>
    </section>
  );
};

export default ContactSection;

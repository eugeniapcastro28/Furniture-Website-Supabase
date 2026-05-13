import React, { useState, useEffect } from 'react'
import styles from './App.module.css';
import logo from './assets/LOGO.png';
import HomePage from './components/HomePage/HomePage';
import TopBar from './components/TopBar/TopBar';
import CategoriesSection from './components/CategoriesSection/CategoriesSection';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <img src={logo} alt="Loading Logo" className={styles.loaderLogo} />
      </div>
    );
  }

  return (
    <main className={styles.mainContent}>
      <TopBar />
      <HomePage />
      <CategoriesSection />
    </main>
  )
}

export default App
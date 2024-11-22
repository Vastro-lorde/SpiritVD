import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/header.jsx';
import Main from './components/Main/Main.jsx';
import Footer from './components/Footer/footer.jsx';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => (localStorage.getItem('theme') && localStorage.getItem('theme') === 'dark') ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const [theme, setTheme] = useState(isDarkMode? 'dark': 'light');

  useEffect(() => {
    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);
  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      <div className="App">
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

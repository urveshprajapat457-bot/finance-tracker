import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('finflow_theme') !== 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('finflow_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('finflow_theme', 'light');
    }
  }, [darkMode]);

  return <ThemeContext.Provider value={{ darkMode, setDarkMode }}>{children}</ThemeContext.Provider>;
};

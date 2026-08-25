import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeModes = createContext(null);

export const useTheme = () => useContext(ThemeModes);

const ThemeContext = ({ children }) => {


  const [theme, settheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });


  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);


  const toggleModes = () => {
    settheme((current) => (
      current === 'light' ? 'dark' : 'light'
    ));
  };

  return (
    <ThemeModes.Provider value={{ theme, toggleModes }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeModes.Provider>
  )
}

export default ThemeContext;
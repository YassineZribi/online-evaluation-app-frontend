import { useState, useEffect, createContext } from 'react';

const ThemeContext = createContext();

export const LIGHT_MODE = 'light'
export const DARK_MODE = 'dark'

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(() => {
    // Get the theme from local storage or default to 'light'
    const storedTheme = localStorage.getItem('theme');
    const newTheme = storedTheme ? storedTheme : LIGHT_MODE

    return newTheme;
  });

  useEffect(() => {
    // Update local storage with the current theme
    localStorage.setItem('theme', theme);
    if (theme === LIGHT_MODE)
      document.documentElement.classList.remove('dark');
    else
    document.documentElement.classList.add('dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
export default ThemeContext;
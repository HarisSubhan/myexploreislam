
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#FFD166");
  const [themeName, setThemeName] = useState("Sunshine");

  const updateTheme = (color, name) => {
    setThemeColor(color);
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ themeColor, themeName, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming
export const useThemeColor = () => useContext(ThemeContext);

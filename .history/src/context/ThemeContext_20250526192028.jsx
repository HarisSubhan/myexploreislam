import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#06D6A0");
  const [themeName, setThemeName] = useState("Mint");

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

export const useThemeContext = () => useContext(ThemeContext);

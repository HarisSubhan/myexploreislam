import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#3A86FF"); // default color
  const [themeName, setThemeName] = useState("Azure");

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

export const useThemeColor = () => useContext(ThemeContext);

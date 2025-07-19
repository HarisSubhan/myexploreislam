// ThemeContext.js
import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState("#3A86FF"); // Default color
  const [themeName, setThemeName] = useState("Azure");
  const [textColor, setTextColor] = useState("#FFFFFF");

  const updateTheme = (color, name, text) => {
    setThemeColor(color);
    setThemeName(name);
    setTextColor(text);
  };

  return (
    <ThemeContext.Provider
      value={{ themeColor, themeName, textColor, updateTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColor = () => useContext(ThemeContext);

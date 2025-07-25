// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    color: "#3A86FF", // Default color
    name: "Azure",
    textColor: "#FFFFFF",
  });

  const updateTheme = (color, name, textColor) => {
    setTheme({ color, name, textColor });
    // Update CSS variables
    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--text-on-primary", textColor);
    // Save to localStorage
    localStorage.setItem("theme", JSON.stringify({ color, name, textColor }));
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const { color, name, textColor } = JSON.parse(savedTheme);
      updateTheme(color, name, textColor);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ ...theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

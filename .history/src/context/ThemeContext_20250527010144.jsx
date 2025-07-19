import React, { createContext, useContext, useState, useMemo } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? JSON.parse(savedTheme)
      : { color: "#FFD166", name: "Sunshine" };
  });

  const updateTheme = (color, name) => {
    const newTheme = { color, name };
    setTheme(newTheme);
    localStorage.setItem("theme", JSON.stringify(newTheme));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      themeColor: theme.color,
      themeName: theme.name,
      updateTheme,
    }),
    [theme.color, theme.name]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

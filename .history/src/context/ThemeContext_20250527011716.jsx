import { useEffect } from "react";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    color: "#3A86FF",
    name: "Azure",
    textColor: "#FFFFFF",
  });

  const updateTheme = (color, name, textColor) => {
    setTheme({ color, name, textColor });
    // Update root CSS variables
    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--text-on-primary", textColor);
    // Save to localStorage for persistence
    localStorage.setItem("theme", JSON.stringify({ color, name, textColor }));
  };

  // Load saved theme on mount
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

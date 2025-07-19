import React from "react";
import { useThemeColor } from "../context/ThemeContext";

const ThemeSelector = () => {
  const { updateTheme } = useThemeColor();

  return (
    <div>
      <button onClick={() => updateTheme("#3A86FF", "Azure")}>Azure</button>
      <button onClick={() => updateTheme("#FB5607", "Pumpkin")}>Pumpkin</button>
    </div>
  );
};

export default ThemeSelector;

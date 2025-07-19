import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useThemeColor } from "../../context/ThemeContext";

const colorOptions = [
  { name: "Sunshine", value: "#FFD166" },
  { name: "Raspberry", value: "#F10666" },
  { name: "Mint", value: "#06D6A0" },
  { name: "Azure", value: "#3A86FF" },
  { name: "Pumpkin", value: "#FB5607" },
];

const ThemeSelector = () => {
  const { themeColor, updateTheme } = useThemeColor();

  return (
    <div className="mb-3">
      <h6>Select Theme:</h6>
      <ButtonGroup>
        {colorOptions.map((color) => (
          <Button
            key={color.value}
            onClick={() => updateTheme(color.value, color.name)}
            style={{
              backgroundColor: color.value,
              border:
                themeColor === color.value
                  ? "3px solid black"
                  : "1px solid #ccc",
              color: "white",
            }}
          >
            {color.name}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default ThemeSelector;

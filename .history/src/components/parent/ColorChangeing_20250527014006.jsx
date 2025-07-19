import React, { useEffect } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext";

const ColorChanging = () => {
  const colorOptions = [
    { name: "Sunshine", value: "#FFD166", textColor: "#000000" },
    { name: "Raspberry", value: "#F10666", textColor: "#FFFFFF" },
    { name: "Mint", value: "#06D6A0", textColor: "#000000" },
    { name: "Azure", value: "#3A86FF", textColor: "#FFFFFF" },
    { name: "Pumpkin", value: "#FB5607", textColor: "#FFFFFF" },
  ];

  const { themeColor, themeName, updateTheme } = useTheme();

  const handleColorChange = (colorValue, colorName, textColor) => {
    updateTheme(colorValue, colorName, textColor);

    document.documentElement.style.setProperty("--primary-color", colorValue);
    document.documentElement.style.setProperty("--text-on-primary", textColor);
  };

  useEffect(() => {
    document.title = `${themeName} Theme - Child Portal`;

    const currentColor =
      colorOptions.find((opt) => opt.value === themeColor) || colorOptions[0];
    handleColorChange(
      currentColor.value,
      currentColor.name,
      currentColor.textColor
    );
  }, []);

  return (
    <Container className="my-4 theme-selector-container">
      <Card className="shadow">
        <Card.Header className="text-center py-3">
          <h4>Portal Theme Customization</h4>
        </Card.Header>
        <Card.Body>
          <Row className="justify-content-center  ">
            {colorOptions.map((color) => (
              <Col
                key={color.value}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="mb-4 "
              >
                <div
                  onClick={() =>
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                  className="theme-color-option"
                  style={{
                    backgroundColor: color.value,
                    color: color.textColor,
                    border:
                      themeColor === color.value
                        ? "3px solid var(--text-on-primary)"
                        : "2px solid #dee2e6",
                  }}
                >
                  {color.name}
                </div>
                <Form.Check
                  type="radio"
                  name="themeColor"
                  label={color.name}
                  checked={themeColor === color.value}
                  onChange={() =>
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                  className="text-center mt-2"
                />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button
              variant="outline-primary"
              onClick={() => {
                const defaultColor = colorOptions[0];
                handleColorChange(
                  defaultColor.value,
                  defaultColor.name,
                  defaultColor.textColor
                );
              }}
            >
              Reset to Default
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Changes apply to your entire portal experience
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ColorChanging;

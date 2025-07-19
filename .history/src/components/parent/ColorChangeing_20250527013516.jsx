import React, { useEffect } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext";
import "./ColorChanging.css"; // Create this CSS file

const ColorChanging = () => {
  const colorOptions = [
    { name: "Sunshine", value: "#FFD166", textColor: "#000000", bgClass: "bg-sunshine" },
    { name: "Raspberry", value: "#F10666", textColor: "#FFFFFF", bgClass: "bg-raspberry" },
    { name: "Mint", value: "#06D6A0", textColor: "#000000", bgClass: "bg-mint" },
    { name: "Azure", value: "#3A86FF", textColor: "#FFFFFF", bgClass: "bg-azure" },
    { name: "Pumpkin", value: "#FB5607", textColor: "#FFFFFF", bgClass: "bg-pumpkin" },
  ];

  const { themeColor, themeName, updateTheme } = useTheme();

  const handleColorChange = (colorValue, colorName, textColor) => {
    updateTheme(colorValue, colorName, textColor);
    document.documentElement.style.setProperty("--primary-color", colorValue);
    document.documentElement.style.setProperty("--text-on-primary", textColor);
  };

  useEffect(() => {
    document.title = `${themeName} Theme - Child Portal`;
    const currentColor = colorOptions.find(opt => opt.value === themeColor) || colorOptions[3]; // Default to Azure
    handleColorChange(currentColor.value, currentColor.name, currentColor.textColor);
  }, []);

  return (
    <Container className="color-changing-container py-4">
      <Card className="theme-card shadow-lg">
        <Card.Header className="theme-card-header py-4">
          <h2 className="mb-0 text-center">Portal Theme Customization</h2>
          <p className="text-muted text-center mb-0">Select your preferred color scheme</p>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-4 justify-content-center">
            {colorOptions.map((color) => (
              <Col key={color.value} xs={6} sm={4} md={3} lg={2} className="d-flex flex-column align-items-center">
                <div
                  onClick={() => handleColorChange(color.value, color.name, color.textColor)}
                  className={`theme-option ${themeColor === color.value ? 'active' : ''} ${color.bgClass}`}
                  aria-label={`Select ${color.name} theme`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleColorChange(color.value, color.name, color.textColor)}
                >
                  <div className="theme-preview" style={{ backgroundColor: color.value }} />
                  <span className="theme-name" style={{ color: color.textColor }}>
                    {color.name}
                  </span>
                </div>
                <Form.Check
                  type="radio"
                  name="themeColor"
                  label={color.name}
                  checked={themeColor === color.value}
                  onChange={() => handleColorChange(color.value, color.name, color.textColor)}
                  className="theme-radio mt-2 visually-hidden"
                />
              </Col>
            ))}
          </Row>
          
          <div className="d-flex justify-content-center mt-5">
            <Button
              variant="outline-primary"
              size="lg"
              className="reset-button"
              onClick={() => handleColorChange(colorOptions[3].value, colorOptions[3].name, colorOptions[3].textColor)}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Reset to Default
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="theme-card-footer text-center py-3">
          <small className="text-muted">
            Changes will be applied across your entire portal experience
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ColorChanging;
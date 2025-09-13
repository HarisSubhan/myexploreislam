import React, { useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
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
    <Container className="my-5">
      <Card className="shadow-lg rounded-4 border-0">
        <Card.Header className="text-center py-4 bg-light border-bottom">
          <h4 className="mb-0">🎨 Customize Your Portal Theme</h4>
          <p className="text-muted mb-0 mt-2">
            Pick a theme to personalize your portal experience
          </p>
        </Card.Header>
        <Card.Body>
          <Row className="g-4 justify-content-center">
            {colorOptions.map((color) => (
              <Col
                key={color.value}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="d-flex flex-column align-items-center"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${color.name} theme`}
                  onClick={() =>
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: color.value,
                    color: color.textColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border:
                      themeColor === color.value
                        ? "4px solid var(--text-on-primary)"
                        : "2px solid #ddd",
                    boxShadow:
                      themeColor === color.value
                        ? "0 0 10px rgba(0,0,0,0.2)"
                        : "0 2px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {color.name[0]}
                </div>
                <span className="mt-2 text-center small">{color.name}</span>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Button
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4"
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
        <Card.Footer className="text-muted text-center py-3">
          Your selected theme applies across the entire portal.
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ColorChanging;

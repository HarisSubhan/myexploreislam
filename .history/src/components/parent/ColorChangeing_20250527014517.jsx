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

  const handleColorChange = (value, name, textColor) => {
    updateTheme(value, name, textColor);
    document.documentElement.style.setProperty("--primary-color", value);
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
      <Card className="glass-card border-0 shadow-lg rounded-4">
        <Card.Header className="bg-transparent text-center border-0 pt-4">
          <h3 className="fw-bold">🖌️ Choose Your Theme</h3>
          <p className="text-muted">Click a color to customize your portal</p>
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
                className="text-center"
              >
                <div
                  className={`theme-bubble ${themeColor === color.value ? "active" : ""}`}
                  style={{
                    backgroundColor: color.value,
                    borderColor:
                      themeColor === color.value ? "#fff" : "transparent",
                  }}
                  onClick={() =>
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleColorChange(color.value, color.name, color.textColor)
                  }
                ></div>
                <div className="mt-2 fw-medium text-muted small">
                  {color.name}
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Button
              variant="light"
              className="px-4 py-2 rounded-pill border"
              onClick={() => {
                const defaultColor = colorOptions[0];
                handleColorChange(
                  defaultColor.value,
                  defaultColor.name,
                  defaultColor.textColor
                );
              }}
            >
              🔄 Reset to Default
            </Button>
          </div>
        </Card.Body>
        <Card.Footer className="text-center text-muted py-3 border-0">
          Your selected theme will apply globally.
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ColorChanging;

import React, { useEffect } from 'react';
import { Container, Card, Row, Col, Form } from 'react-bootstrap';
import { useThemeColor } from '../../context/

const ColorChanging = () => {
  const colorOptions = [
    { name: 'Sunshine', value: '#FFD166' },
    { name: 'Raspberry', value: '#F10666' },
    { name: 'Mint', value: '#06D6A0' },
    { name: 'Azure', value: '#3A86FF' },
    { name: 'Pumpkin', value: '#FB5607' }
  ];

  const { themeColor, themeName, updateTheme } = useThemeColor();

  const handleColorChange = (colorValue, colorName) => {
    updateTheme(colorValue, colorName);
  };

  useEffect(() => {
    document.title = `${themeName} Theme Preview`;
  }, [themeName]);

  return (
    <Container className="my-4">
      <Card>
        <Card.Header>Choose Theme</Card.Header>
        <Card.Body>
          <Row>
            {colorOptions.map((color) => (
              <Col key={color.value} xs={6} md={4} lg={2}>
                <div
                  onClick={() => handleColorChange(color.value, color.name)}
                  style={{
                    backgroundColor: color.value,
                    height: '60px',
                    borderRadius: '8px',
                    border: themeColor === color.value ? '4px solid black' : '2px solid #ccc',
                    cursor: 'pointer',
                  }}
                />
                <Form.Check
                  type="radio"
                  label={color.name}
                  checked={themeColor === color.value}
                  onChange={() => handleColorChange(color.value, color.name)}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ColorChanging;

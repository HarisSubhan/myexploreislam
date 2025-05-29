import React from 'react';
import Card from 'react-bootstrap/Card';

const StatCard = ({ title, value, icon, bg }) => {
  return (
    <Card className={`text-white mb-4`} style={{ backgroundColor: bg }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Text style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</Card.Text>
        </div>
        <div style={{ fontSize: '2rem' }}>{icon}</div>
      </Card.Body>
    </Card>
  );
};

export default StatCard;

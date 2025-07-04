import React, { useEffect, useState } from "react";
import "./falling.css";

const items = ["A", "B", "C", "1", "2", "3","+", "-", "x", "ا", "ب", "ت" ];

const FallingElements = () => {
  const [falling, setFalling] = useState([]);
  const [landed, setLanded] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9);
      const left = Math.random() * 90 + 5;
      const emoji = items[Math.floor(Math.random() * items.length)];

      setFalling((prev) => [...prev, { id, left, emoji }]);

      setTimeout(() => {
        setFalling((prev) => prev.filter((e) => e.id !== id));
        setLanded((prev) => [...prev, { id, left, emoji }]);
      }, 3000);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="falling-container">
      {falling.map((el) => (
        <div key={el.id} className="falling-item" style={{ left: `${el.left}%` }}>
          {el.emoji}
        </div>
      ))}

      <div className="landing-zone">
        {landed.map((el) => (
          <div key={el.id} className="landed-item" style={{ left: `${el.left}%` }}>
            {el.emoji}
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default FallingElements;

import React, { useEffect, useState } from 'react';
import './FallingBlocks.css';

const FallingBlocks = () => {
  const [showBlocks, setShowBlocks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlocks(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showBlocks) return null;

  return (
    <div className="falling-blocks-container">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="falling-block"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 80%, 70%)`,
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
            borderRadius: `${Math.random() * 20}px`,
          }}
        />
      ))}
    </div>
  );
};

export default FallingBlocks;
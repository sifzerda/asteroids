// src/components/Asteroid.js
import React, { useState, useEffect } from 'react';

const Asteroid = ({ initialPosition }) => {
    const [position, setPosition] = useState(initialPosition);
    const [velocity, setVelocity] = useState({
      x: (Math.random() * 2 - 1) * 2, // Random x velocity (-2 to 2)
      y: (Math.random() * 2 - 1) * 2, // Random y velocity (-2 to 2)
    });

    useEffect(() => {
        const moveAsteroid = () => {
          setPosition(prevPosition => ({
            x: prevPosition.x + velocity.x,
            y: prevPosition.y + velocity.y,
          }));
        };
    
        const asteroidInterval = setInterval(() => {
          moveAsteroid();
        }, 100); // Adjust speed of asteroid movement
    
        return () => clearInterval(asteroidInterval);
      }, [velocity]);
    
      const asteroidStyle = {
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '50px',
        height: '50px',
        backgroundColor: 'gray',
        borderRadius: '50%',
      };
    
      return <div className="asteroid" style={asteroidStyle}></div>;
    };
    
    export default Asteroid;
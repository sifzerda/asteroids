// src/components/Asteroid.js
import { useState, useEffect } from 'react';

const Asteroid = ({ initialPosition }) => {
    const [position, setPosition] = useState(initialPosition);
    const [velocity, setVelocity] = useState({
      x: (Math.random() * 2 - 1) * 2, // Random x velocity (-2 to 2)
      y: (Math.random() * 2 - 1) * 2, // Random y velocity (-2 to 2)
    });

    useEffect(() => {
      const moveAsteroid = () => {
        setPosition(prevPosition => ({
          x: wrapPosition(prevPosition.x + velocity.x, 'x'),
          y: wrapPosition(prevPosition.y + velocity.y, 'y'),
        }));
      };
    
        const asteroidInterval = setInterval(() => {
          moveAsteroid();
        }, 100); // Adjust speed of asteroid movement
    
        return () => clearInterval(asteroidInterval);
      }, [velocity]);

      const wrapPosition = (value, axis) => {
        const maxValue = axis === 'x' ? 900 : 500; // Width and height of game board
        const buffer = 40; // Buffer zone beyond the boundary
    
        if (value < -buffer) {
          return maxValue + buffer + value;
        } else if (value > maxValue + buffer) {
          return value - maxValue - buffer;
        }
        return value;
      };

      // consider putting below in css file if possible    
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
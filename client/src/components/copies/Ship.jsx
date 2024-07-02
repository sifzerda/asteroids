// src/components/Ship.js
import { useState, useEffect } from 'react';

const Ship = () => {
    const [position, setPosition] = useState({ x: 300, y: 300 });
    const [rotation, setRotation] = useState(0);
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        switch (e.key) {
          case 'ArrowUp':
            moveShip();
            break;
          case 'ArrowLeft':
            rotateShip('left');
            break;
          case 'ArrowRight':
            rotateShip('right');
            break;
          default:
            break;
        }
      };
  
      document.addEventListener('keydown', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [position, rotation]);
  
    const moveShip = () => {
      const speed = 5; // Adjust as needed
      const newX = position.x + Math.sin(rotation * (Math.PI / 180)) * speed;
      const newY = position.y - Math.cos(rotation * (Math.PI / 180)) * speed;
      setPosition({ x: newX, y: newY });
    };
  
    const rotateShip = (direction) => {
      const rotationSpeed = 5; // Adjust as needed
      let newRotation = rotation;
      if (direction === 'left') {
        newRotation -= rotationSpeed;
      } else if (direction === 'right') {
        newRotation += rotationSpeed;
      }
      setRotation(newRotation);
    };
  
    const shipStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '30px',
      height: '30px',
      backgroundColor: 'white',
      transform: `rotate(${rotation}deg)`,
    };
  
    return <div className="ship" style={shipStyle}></div>;
  };
  
  export default Ship;
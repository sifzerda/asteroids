import { useState, useEffect } from 'react';

const Ship = ({ position, onShoot }) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

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
        case ' ':
          onShoot(); // Call shoot function when spacebar is pressed
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPosition, rotation, onShoot]);

  const moveShip = () => {
    const speed = 5; // Adjust as needed
    const newX = currentPosition.x + Math.sin(rotation * (Math.PI / 180)) * speed;
    const newY = currentPosition.y - Math.cos(rotation * (Math.PI / 180)) * speed;
    setCurrentPosition({ x: wrapPosition(newX, 'x'), y: wrapPosition(newY, 'y') });
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

  // wrapPosition wraps the screen boundary around so ship re-enters 
  // the buffer allows ship to pass a little beyond the boundary before re-entering
  const wrapPosition = (value, axis) => {
    const maxValue = axis === 'x' ? 900 : 500; // Width and height of game board
    const buffer = 30; // Adjust the buffer zone as needed

    if (value < -buffer) {
      return maxValue + buffer + value;
    } else if (value > maxValue + buffer) {
      return value - maxValue - buffer;
    }
    return value;
  };

  const shipStyle = {
    position: 'absolute',
    left: `${currentPosition.x}px`,
    top: `${currentPosition.y}px`,
    width: '30px',
    height: '30px',
    backgroundColor: 'white',
    transform: `rotate(${rotation}deg)`,
  };

  return <div className="ship" style={shipStyle}></div>;
};

export default Ship;
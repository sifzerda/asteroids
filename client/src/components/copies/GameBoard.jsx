// GameBoard.js
import { useState, useEffect } from 'react';
import Ship from './Ship';
import Asteroid from './Asteroid';

const GameBoard = () => {
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle ship movement
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
  }, [shipPosition]);

  const moveShip = () => {
    // Calculate new position based on current rotation
    const newX = shipPosition.x + Math.sin(shipPosition.rotation * Math.PI / 180) * 5;
    const newY = shipPosition.y - Math.cos(shipPosition.rotation * Math.PI / 180) * 5;
    setShipPosition(prevPosition => ({ ...prevPosition, x: newX, y: newY }));
  };

  const rotateShip = (direction) => {
    const rotationSpeed = 5; // Adjust as needed
    let newRotation = shipPosition.rotation;
    if (direction === 'left') {
      newRotation -= rotationSpeed;
    } else if (direction === 'right') {
      newRotation += rotationSpeed;
    }
    setShipPosition(prevPosition => ({ ...prevPosition, rotation: newRotation }));
  };

  // Game loop using useEffect and requestAnimationFrame
  useEffect(() => {
    const gameLoop = () => {
      // Update game state
      updateGame();
      // Request next frame
      requestAnimationFrame(gameLoop);
    };
    gameLoop(); // Start the game loop
  }, []);

  // Update game state
  const updateGame = () => {
    // Update asteroids, check collisions, etc.
    // Example: Move asteroids
    setAsteroids(prevAsteroids => (
      prevAsteroids.map(asteroid => ({
        ...asteroid,
        x: asteroid.x + asteroid.velocityX,
        y: asteroid.y + asteroid.velocityY,
      }))
    ));
    // Check for collisions, update score, etc.
  };

  return (
    <div className="game-board">
      <Ship position={shipPosition} />
      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} position={asteroid} />
      ))}
    </div>
  );
};

export default GameBoard;
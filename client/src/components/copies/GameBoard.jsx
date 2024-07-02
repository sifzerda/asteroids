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
    const speed = 5; // Adjust as needed
    const newX = shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * speed;
    const newY = shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * speed;
    setShipPosition(prevPosition => ({
      ...prevPosition,
      x: clamp(newX, 0, 600), // Clamp ship's x position between 0 and 600
      y: clamp(newY, 0, 400), // Clamp ship's y position between 0 and 400
    }));
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
    const initialAsteroids = [
      { x: 100, y: 100 },
      { x: 400, y: 200 },
    ];

    const gameLoop = () => {
      // Update game state
      updateGame();
      // Request next frame
      requestAnimationFrame(gameLoop);
    };

    gameLoop(); // Start the game loop
    setAsteroids(initialAsteroids);
    return () => cancelAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      requestAnimationFrame(gameLoop);
    };       
    gameLoop();
  }, []);

  // Update game state
  const updateGame = () => {
    // Update asteroids
    setAsteroids(prevAsteroids => (
      prevAsteroids.map(asteroid => ({
        ...asteroid,
        x: wrapPosition(asteroid.x + Math.random() * 2 - 1, 'x'),
        y: wrapPosition(asteroid.y + Math.random() * 2 - 1, 'y'),
      }))
    ));
    // Additional game logic such as collision detection can be added here
  };

  const wrapPosition = (value, axis) => {
    const maxValue = axis === 'x' ? 600 : 400; // Width and height of game board
    if (value < 0) {
      return maxValue + value;
    } else if (value > maxValue) {
      return value - maxValue;
    }
    return value;
  };

  const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  };

  return (
    <div className="game-board">
      <Ship position={shipPosition} />
      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} initialPosition={asteroid} />
      ))}
    </div>
  );
};

export default GameBoard;
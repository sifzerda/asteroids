import { useState, useEffect } from 'react';
import Ship from './Ship';
import Asteroid from './Asteroid';
import Projectile from './Projectile';
//import StartGame from '../components/StartGame';
//import HighScores from '../components/HighScores';
//import FinalScore from '../components/FinalScore';

const GameBoard = () => {
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);

// Event listener for keyboard input--------------------//

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
          case ' ':
            shootProjectile();
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

// MOVING SHIP -----------------------------------------//

  const moveShip = () => {
    const speed = 5; // Adjust as needed
    const newX = shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * speed;
    const newY = shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * speed;
    setShipPosition(prevPosition => ({
      ...prevPosition,
      x: wrapPosition(newX, 'x'), // Ensure wrapping for ship's x position
      y: wrapPosition(newY, 'y'), // Ensure wrapping for ship's y position
    }));
  };

// 360o ROTATING SHIP ---------------------------------//

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

// SHOOTING PROJECTILES --------------------------------//

const shootProjectile = () => {
  const speed = 10; // Adjust as needed
  const newProjectile = {
    x: shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * 15, // Start slightly ahead of the ship
    y: shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * 15,
    rotation: shipPosition.rotation,
    speed,
  };
  setProjectiles(prevProjectiles => [...prevProjectiles, newProjectile]);
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
  setAsteroids((prevAsteroids) =>
    prevAsteroids.map((asteroid) => ({
      ...asteroid,
      x: wrapPosition(asteroid.x + Math.random() * 2 - 1, 'x'),
      y: wrapPosition(asteroid.y + Math.random() * 2 - 1, 'y'),
    }))
  );

  setProjectiles((prevProjectiles) =>
    prevProjectiles.map((projectile) => ({
      ...projectile,
      x: wrapPosition(projectile.x + Math.sin(projectile.rotation * (Math.PI / 180)) * projectile.speed, 'x'),
      y: wrapPosition(projectile.y - Math.cos(projectile.rotation * (Math.PI / 180)) * projectile.speed, 'y'),
    }))
  );
};

// WRAP GAME BOUNDARIES --------------------------------//

const wrapPosition = (value, axis) => {
  const maxValue = axis === 'x' ? 900 : 500; // Width and height of game board
  if (value < 0) {
    return maxValue + value;
  } else if (value > maxValue) {
    return value - maxValue;
  }
  return value;
};

// RENDER-----------------------------------------------//

return (
  <div className="game-board">
    <Ship position={shipPosition} onShoot={shootProjectile} />
    {asteroids.map((asteroid, index) => (
      <Asteroid key={index} initialPosition={asteroid} />
    ))}
    {projectiles.map((projectile, index) => (
      <Projectile key={index} position={projectile} />
    ))}
  </div>
);
};

export default GameBoard;
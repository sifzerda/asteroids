import { useState, useEffect, useRef } from 'react';
import Asteroid from './Asteroid';

const GameBoard = () => {
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);

  const requestRef = useRef();

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

  const moveShip = () => {
    const speed = 5; // Adjust as needed
    const newX = shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * speed;
    const newY = shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * speed;
    setShipPosition(prevPosition => ({
      ...prevPosition,
      x: wrapPosition(newX, 'x'),
      y: wrapPosition(newY, 'y'),
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

  const shootProjectile = () => {
    const speed = 10; // Adjust as needed
    const newProjectile = {
      x: shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * 15,
      y: shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * 15,
      rotation: shipPosition.rotation,
      speed,
      lifetime: 100, // Adjust as needed
    };
    setProjectiles(prevProjectiles => [...prevProjectiles, newProjectile]);
  };

  useEffect(() => {
    const initialAsteroids = [
      { x: 100, y: 100 },
      { x: 400, y: 200 },
    ];
    setAsteroids(initialAsteroids);

    const gameLoop = () => {
      updateGame();
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const updateGame = () => {
    setAsteroids(prevAsteroids =>
      prevAsteroids.map(asteroid => ({
        ...asteroid,
        x: wrapPosition(asteroid.x + Math.random() * 2 - 1, 'x'),
        y: wrapPosition(asteroid.y + Math.random() * 2 - 1, 'y'),
      }))
    );

    setProjectiles(prevProjectiles =>
      prevProjectiles
        .map(projectile => ({
          ...projectile,
          x: wrapPosition(projectile.x + Math.sin(projectile.rotation * (Math.PI / 180)) * projectile.speed, 'x'),
          y: wrapPosition(projectile.y - Math.cos(projectile.rotation * (Math.PI / 180)) * projectile.speed, 'y'),
          lifetime: projectile.lifetime - 1,
        }))
        .filter(projectile => projectile.lifetime > 0)
    );
  };

  const wrapPosition = (value, axis) => {
    const maxValue = axis === 'x' ? 900 : 500; // Width and height of game board
    if (value < 0) {
      return maxValue + value;
    } else if (value > maxValue) {
      return value - maxValue;
    }
    return value;
  };

  const shipStyle = {
    position: 'absolute',
    left: `${shipPosition.x}px`,
    top: `${shipPosition.y}px`,
    width: '30px',
    height: '30px',
    backgroundColor: 'white',
    transform: `rotate(${shipPosition.rotation}deg)`,
  };

  const Projectile = ({ position }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        // Handle projectile expiration logic here if needed
      }, position.lifetime);

      return () => clearTimeout(timer);
    }, [position]);

    const projectileStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '5px',
      height: '5px',
      backgroundColor: 'red',
      transform: `rotate(${position.rotation}deg)`,
    };

    return <div className="projectile" style={projectileStyle}></div>;
  };
  
  return (
    <div className="game-board">
      <div className="ship" style={shipStyle}></div>
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
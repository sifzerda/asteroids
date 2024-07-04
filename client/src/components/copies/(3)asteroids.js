import { useState, useEffect, useRef } from 'react';
import FinalScore from './FinalScore';
import HighScores from './HighScores';

const Asteroids = () => {
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false); // State to track game over
  const [showHighScores, setShowHighScores] = useState(false);
  
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
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shipPosition]);

  const moveShip = () => updateShipPosition('move');
  const rotateShip = (direction) => updateShipPosition(direction);

  const updateShipPosition = (action) => {
    const speed = action === 'move' ? 5 : 5; // Adjust as needed
    const rotationSpeed = action === 'left' ? -5 : action === 'right' ? 5 : 0; // Adjust as needed

    setShipPosition(prevPosition => ({
      ...prevPosition,
      x: wrapPosition(
        prevPosition.x + Math.sin(prevPosition.rotation * (Math.PI / 180)) * speed,
        'x'
      ),
      y: wrapPosition(
        prevPosition.y - Math.cos(prevPosition.rotation * (Math.PI / 180)) * speed,
        'y'
      ),
      rotation: (prevPosition.rotation + rotationSpeed) % 360,
    }));
    // Check for collisions after moving the ship
    checkCollisions();
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
      { x: 100, y: 100, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 1 },
      { x: 400, y: 200, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 2 },
    ];
    setAsteroids(initialAsteroids);

    const gameLoop = () => {
      if (!gameOver) {
        updateGame();
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver]);

  const updateGame = () => {
    setAsteroids(prevAsteroids =>
      prevAsteroids.map(asteroid => ({
        ...asteroid,
        x: wrapPosition(asteroid.x + asteroid.velocity.x, 'x'),
        y: wrapPosition(asteroid.y + asteroid.velocity.y, 'y'),
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
    // Check for collisions during game loop
    checkCollisions();
  };

  const wrapPosition = (value, axis) => {
    const maxValue = axis === 'x' ? 1500 : 680; // Width and height of game board
    const buffer = 30;
    if (value < -buffer) {
      return maxValue + buffer + value;
    } else if (value > maxValue + buffer) {
      return value - maxValue - buffer;
    }
    return value;
  };

  const checkCollisions = () => {
    const shipRadius = 18; // Adjust ship radius as needed
    asteroids.forEach(asteroid => {
      const asteroidRadius = 25; // Adjust asteroid radius as needed
      const distance = Math.sqrt((shipPosition.x - asteroid.x) ** 2 + (shipPosition.y - asteroid.y) ** 2);
      if (distance < shipRadius + asteroidRadius) {
        handleCollision();
      }
    });

    // Check for projectile-asteroid collisions
    projectiles.forEach((projectile, pIndex) => {
      asteroids.forEach((asteroid, aIndex) => {
        const projectileRadius = 15; // Adjust projectile radius as needed
        const asteroidRadius = 25; // Adjust asteroid radius as needed
        const distance = Math.sqrt((projectile.x - asteroid.x) ** 2 + (projectile.y - asteroid.y) ** 2);
        if (distance < projectileRadius + asteroidRadius) {
          handleProjectileCollision(aIndex, pIndex);
        }
      });
    });
  };

  const handleCollision = () => {
    setGameOver(true); // Set game over state or handle collision logic here
  };

  // newHits creates a hit counter
  const handleProjectileCollision = (asteroidIndex, projectileIndex) => {
    const newAsteroids = [];
    setAsteroids(prevAsteroids => {
      prevAsteroids.forEach((asteroid, index) => {
        if (index === asteroidIndex) {
          // Break asteroid into two smaller asteroids
          const newSize = asteroid.size / 3; // New size is one-third of original size
          const newVelocity1 = { x: asteroid.velocity.x + 1, y: asteroid.velocity.y + 1 }; // Adjust velocities as needed
          const newVelocity2 = { x: asteroid.velocity.x - 1, y: asteroid.velocity.y - 1 }; // Adjust velocities as needed
          newAsteroids.push({
            ...asteroid,
            x: asteroid.x,
            y: asteroid.y,
            velocity: newVelocity1,
            size: newSize,
            id: asteroid.id * 10 + 1, // Example of assigning unique ids for new asteroids
          });
          newAsteroids.push({
            ...asteroid,
            x: asteroid.x,
            y: asteroid.y,
            velocity: newVelocity2,
            size: newSize,
            id: asteroid.id * 10 + 2,
          });
        } else {
          newAsteroids.push(asteroid);
        }
      });
      return newAsteroids;
    });
    setProjectiles(prevProjectiles => prevProjectiles.filter((_, index) => index !== projectileIndex));
  };

  const shipStyle = {
    left: `${shipPosition.x}px`,
    top: `${shipPosition.y}px`,
    transform: `rotate(${shipPosition.rotation}deg)`,
  };

  const Projectile = ({ position }) => {
    useEffect(() => {
      const timer = setTimeout(() => {}, position.lifetime);
      return () => clearTimeout(timer);
    }, [position]);

    const projectileStyle = {
      left: `${position.x}px`,
      top: `${position.y}px`,
      transform: `rotate(${position.rotation}deg)`,
    };

    return <div className="projectile" style={projectileStyle}></div>;
  };

  const Asteroid = ({ asteroid }) => {
    const [astPosition, setAstPosition] = useState(asteroid);
  
    useEffect(() => {
      const moveAsteroid = () => {
        setAstPosition(prevAstPosition => ({
          x: wrapPosition(prevAstPosition.x + asteroid.velocity.x, 'x'),
          y: wrapPosition(prevAstPosition.y + asteroid.velocity.y, 'y'),
        }));
      };
  
      const asteroidInterval = setInterval(moveAsteroid, 100); // Set asteroid speed
      return () => clearInterval(asteroidInterval);
    }, [asteroid]);
  
    const asteroidStyle = {
      left: `${astPosition.x}px`,
      top: `${astPosition.y}px`,
      width: `${asteroid.size}px`, // Adjust size based on the asteroid's size property
      height: `${asteroid.size}px`, // Adjust size based on the asteroid's size property
    };

    // conditionally renders normal or smaller asteroid
    const asteroidClassName = asteroid.size < 50 ? 'asteroid-half' : 'asteroid';

    return <div className={asteroidClassName} style={asteroidStyle}></div>;
  };

  return (
    <div className="game-board">
      {!gameOver && <div className="ship" style={shipStyle}></div>}
      {asteroids.map((asteroid) => (
        <Asteroid key={asteroid.id} asteroid={asteroid} />
      ))}
      {projectiles.map((projectile, index) => (
        <Projectile key={index} position={projectile} />
      ))}
      {gameOver && <FinalScore />}
    </div>
  );
};

export default Asteroids;
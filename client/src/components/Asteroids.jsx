import { useState, useEffect, useRef } from 'react';

const Asteroids = () => {
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
      { x: 100, y: 100, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 } },
      { x: 400, y: 200, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 } },
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

  const Asteroid = ({ asteroid }) => {
    const [astPosition, setAstPosition] = useState(asteroid);

    useEffect(() => {
      const moveAsteroid = () => {
        setAstPosition(prevAstPosition => ({
          x: wrapPosition(prevAstPosition.x + asteroid.velocity.x, 'x'),
          y: wrapPosition(prevAstPosition.y + asteroid.velocity.y, 'y'),
        }));
      };
      
      const asteroidInterval = setInterval(moveAsteroid, 100); //set asteroid speed
      return () => clearInterval(asteroidInterval);
    }, [asteroid]);

    const asteroidStyle = {
      position: 'absolute',
      left: `${astPosition.x}px`,
      top: `${astPosition.y}px`,
      width: '50px',
      height: '50px',
      backgroundColor: 'gray',
      borderRadius: '50%',
    };

    return <div className="asteroid" style={asteroidStyle}></div>;
  };

  return (
    <div className="game-board">
      <div className="ship" style={shipStyle}></div>
      {asteroids.map(asteroid => (
        <Asteroid key={asteroid.id} asteroid={asteroid} />
      ))}
      {projectiles.map((projectile, index) => (
        <Projectile key={index} position={projectile} />
      ))}
    </div>
  );
};

export default Asteroids;
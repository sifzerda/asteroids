import { useSpring, animated } from 'react-spring';
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter from 'matter-js';
import FinalScore from './FinalScore';

const Asteroids = () => {
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  
  const requestRef = useRef();
  const engineRef = useRef(Matter.Engine.create()); // Initialize here
  const shipRef = useRef();
  const asteroidRefs = useRef([]);
  const projectileRefs = useRef([]);

  useEffect(() => {
    // Initialize the engine
    const { engine } = engineRef.current;

    const ship = Matter.Bodies.rectangle(shipPosition.x, shipPosition.y, 40, 40, { label: 'ship' });
    Matter.World.add(engine.world, ship);
    shipRef.current = ship;
    
    const initialAsteroids = [
      { x: 100, y: 100, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 1 },
      { x: 400, y: 200, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 2 },
    ];
    
    initialAsteroids.forEach((asteroid) => {
      const asteroidBody = Matter.Bodies.circle(asteroid.x, asteroid.y, asteroid.size / 2, { label: 'asteroid' });
      Matter.World.add(engine.world, asteroidBody);
      asteroidRefs.current.push(asteroidBody);
    });
    
    setAsteroids(initialAsteroids);

    const gameLoop = () => {
      if (!gameOver) {
        Matter.Engine.update(engine, 1000 / 60);
        updateGame();
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
      Matter.Engine.clear(engine);
    };
  }, [gameOver]);

  const updateGame = () => {
    setShipPosition({
      x: shipRef.current.position.x,
      y: shipRef.current.position.y,
      rotation: shipRef.current.angle * (180 / Math.PI),
    });

    setAsteroids(prevAsteroids =>
      prevAsteroids.map((asteroid, index) => ({
        ...asteroid,
        x: asteroidRefs.current[index].position.x,
        y: asteroidRefs.current[index].position.y,
      }))
    );

    setProjectiles(prevProjectiles =>
      prevProjectiles.map((projectile, index) => ({
        ...projectile,
        x: projectileRefs.current[index].position.x,
        y: projectileRefs.current[index].position.y,
        lifetime: projectile.lifetime - 1,
      })).filter(projectile => projectile.lifetime > 0)
    );
    
    checkCollisions();
  };

  const moveShip = () => updateShipPosition('move');
  const rotateShip = (direction) => updateShipPosition(direction);

  const updateShipPosition = (action) => {
    const forceMagnitude = action === 'move' ? 0.005 : 0;
    const rotationForce = action === 'left' ? -0.05 : action === 'right' ? 0.05 : 0;

    Matter.Body.applyForce(
      shipRef.current,
      { x: shipRef.current.position.x, y: shipRef.current.position.y },
      { x: Math.sin(shipRef.current.angle) * forceMagnitude, y: -Math.cos(shipRef.current.angle) * forceMagnitude }
    );
    
    Matter.Body.setAngularVelocity(shipRef.current, rotationForce);
    checkCollisions();
  };

  const shootProjectile = () => {
    const speed = 10;
    const projectile = Matter.Bodies.circle(
      shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * 15,
      shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * 15,
      5,
      { label: 'projectile' }
    );

    Matter.Body.setVelocity(projectile, {
      x: Math.sin(shipPosition.rotation * (Math.PI / 180)) * speed,
      y: -Math.cos(shipPosition.rotation * (Math.PI / 180)) * speed,
    });

    Matter.World.add(engineRef.current.world, projectile);
    projectileRefs.current.push(projectile);
    
    setProjectiles(prevProjectiles => [
      ...prevProjectiles,
      {
        x: projectile.position.x,
        y: projectile.position.y,
        rotation: shipPosition.rotation,
        speed,
        lifetime: 100,
      },
    ]);
  };

  useHotkeys('up', moveShip, [shipPosition]);
  useHotkeys('left', () => rotateShip('left'), [shipPosition]);
  useHotkeys('right', () => rotateShip('right'), [shipPosition]);
  useHotkeys('space', shootProjectile, [shipPosition]);

  const wrapPosition = (value, axis) => {
    const maxValue = axis === 'x' ? 1500 : 680;
    const buffer = 30;
    if (value < -buffer) {
      return maxValue + buffer + value;
    } else if (value > maxValue + buffer) {
      return value - maxValue - buffer;
    }
    return value;
  };

  const checkCollisions = () => {
    const shipRadius = 18;
    asteroids.forEach((asteroid, index) => {
      const asteroidRadius = 25;
      const distance = Math.sqrt((shipPosition.x - asteroid.x) ** 2 + (shipPosition.y - asteroid.y) ** 2);
      if (distance < shipRadius + asteroidRadius) {
        handleCollision();
      }
    });

    projectiles.forEach((projectile, pIndex) => {
      asteroids.forEach((asteroid, aIndex) => {
        const projectileRadius = 15;
        const asteroidRadius = 25;
        const distance = Math.sqrt((projectile.x - asteroid.x) ** 2 + (projectile.y - asteroid.y) ** 2);
        if (distance < projectileRadius + asteroidRadius) {
          handleProjectileCollision(aIndex, pIndex);
        }
      });
    });
  };

  const handleCollision = () => {
    setGameOver(true);
  };

  const handleProjectileCollision = (asteroidIndex, projectileIndex) => {
    const newAsteroids = [];
    setAsteroids(prevAsteroids => {
      prevAsteroids.forEach((asteroid, index) => {
        if (index === asteroidIndex) {
          const newSize = asteroid.size / 3;
          const newVelocity1 = { x: asteroid.velocity.x + 1, y: asteroid.velocity.y + 1 };
          const newVelocity2 = { x: asteroid.velocity.x - 1, y: asteroid.velocity.y - 1 };
          
          const asteroidBody1 = Matter.Bodies.circle(asteroid.x, asteroid.y, newSize / 2, { label: 'asteroid' });
          Matter.Body.setVelocity(asteroidBody1, newVelocity1);
          
          const asteroidBody2 = Matter.Bodies.circle(asteroid.x, asteroid.y, newSize / 2, { label: 'asteroid' });
          Matter.Body.setVelocity(asteroidBody2, newVelocity2);
          
          Matter.World.add(engineRef.current.world, asteroidBody1);
          Matter.World.add(engineRef.current.world, asteroidBody2);
          
          newAsteroids.push({ ...asteroid, size: newSize, velocity: newVelocity1, id: asteroid.id * 10 + 1 });
          newAsteroids.push({ ...asteroid, size: newSize, velocity: newVelocity2, id: asteroid.id * 10 + 2 });
          
          asteroidRefs.current.splice(index, 1, asteroidBody1, asteroidBody2);
        } else {
          newAsteroids.push(asteroid);
        }
      });
      return newAsteroids;
    });
    setProjectiles(prevProjectiles => prevProjectiles.filter((_, index) => index !== projectileIndex));
    Matter.World.remove(engineRef.current.world, projectileRefs.current[projectileIndex]);
    projectileRefs.current.splice(projectileIndex, 1);
  };

const shipStyle = useSpring({
  left: `${shipPosition.x}px`,
  top: `${shipPosition.y}px`,
  transform: `rotate(${shipPosition.rotation}deg)`,
  config: {
    tension: 280,    // Adjust tension for the ship's movement responsiveness
    friction: 60,    // Adjust friction for the ship's movement responsiveness
    mass: 1,         // Adjust mass for the ship's movement responsiveness
    clamp: false,    // Allow ship to move freely without clamping
    velocity: 0,     // Start with zero initial velocity
    precision: 0.1,  // Higher precision for smoother animations
    duration: 500,   // Explicit duration for animations
  },
});

const Projectile = ({ position }) => {
  useEffect(() => {
    const timer = setTimeout(() => {}, position.lifetime);
    return () => clearTimeout(timer);
  }, [position]);
  
  const projectileStyle = useSpring({
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${position.rotation}deg)`,
    config: {
      tension: 170,
      friction: 26,
      mass: 1,
      clamp: false,
      velocity: 0,
      precision: 0.01,
      duration: 500,
    },
  });
  
  return <animated.div className="projectile" style={projectileStyle}></animated.div>;
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

  const asteroidStyle = useSpring({
    left: `${astPosition.x}px`,
    top: `${astPosition.y}px`,
    width: `${asteroid.size}px`,
    height: `${asteroid.size}px`,
    config: { 
      tension: 120,    // Adjust tension for the asteroid's movement responsiveness
      friction: 14,    // Adjust friction for the asteroid's movement responsiveness
      mass: 1,         // Adjust mass for different asteroid sizes
      clamp: false,    // Allow asteroids to move freely without clamping
      velocity: 0,     // Start with zero initial velocity
      precision: 0.1,  // Higher precision for smoother animations
      duration: 500,   // Explicit duration for animations
    },
  });

  // conditionally renders normal or smaller asteroid
  const asteroidClassName = asteroid.size < 50 ? 'asteroid-half' : 'asteroid';

  return <animated.div className={asteroidClassName} style={asteroidStyle}></animated.div>;
};

return (
  <div className="game-board">
    {!gameOver && <animated.div className="ship" style={shipStyle}></animated.div>}
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
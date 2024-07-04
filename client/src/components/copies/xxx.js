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
  const engineRef = useRef(Matter.Engine.create());
  const shipRef = useRef();
  const asteroidRefs = useRef([]);
  const projectileRefs = useRef([]);

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
  };

  const shootProjectile = () => {
    const speed = 10;
    const newProjectile = Matter.Bodies.circle(
      shipPosition.x + Math.sin(shipPosition.rotation * (Math.PI / 180)) * 15,
      shipPosition.y - Math.cos(shipPosition.rotation * (Math.PI / 180)) * 15,
      5,
      { label: 'projectile' }
    );

    Matter.Body.setVelocity(newProjectile, {
      x: Math.sin(shipPosition.rotation * (Math.PI / 180)) * speed,
      y: -Math.cos(shipPosition.rotation * (Math.PI / 180)) * speed,
    });

    Matter.World.add(engineRef.current.world, newProjectile);
    projectileRefs.current.push(newProjectile);

    setProjectiles(prevProjectiles => [
      ...prevProjectiles,
      {
        x: newProjectile.position.x,
        y: newProjectile.position.y,
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

  useEffect(() => {
    const initialAsteroids = [
      { x: 100, y: 100, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 1 },
      { x: 400, y: 200, velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 }, size: 50, id: 2 },
    ];

    initialAsteroids.forEach((asteroid) => {
      const asteroidBody = Matter.Bodies.circle(asteroid.x, asteroid.y, asteroid.size / 2, { label: 'asteroid' });
      Matter.World.add(engineRef.current.world, asteroidBody);
      asteroidRefs.current.push(asteroidBody);
    });

    setAsteroids(initialAsteroids);

    const gameLoop = () => {
      if (!gameOver) {
        Matter.Engine.update(engineRef.current, 1000 / 60);
        updateGame();
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(requestRef.current);
      Matter.Engine.clear(engineRef.current);
    };
  }, [gameOver]);

  const updateGame = () => {
    checkCollisions();

    const updatedShipPosition = {
      x: wrapPosition(shipRef.current.position.x, 'x'),
      y: wrapPosition(shipRef.current.position.y, 'y'),
      rotation: (shipRef.current.angle * (180 / Math.PI)) % 360,
    };
    setShipPosition(updatedShipPosition);

    setAsteroids(asteroids.map((asteroid, index) => {
      const updatedAsteroid = {
        ...asteroid,
        x: wrapPosition(asteroidRefs.current[index].position.x, 'x'),
        y: wrapPosition(asteroidRefs.current[index].position.y, 'y'),
      };
      return updatedAsteroid;
    }));

    setProjectiles(projectiles.filter((projectile, index) => {
      const projectileBody = projectileRefs.current[index];
      return projectileBody && projectileBody.position.x >= 0 && projectileBody.position.x <= 1500 && projectileBody.position.y >= 0 && projectileBody.position.y <= 680;
    }));
  };

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
          const newSize = asteroid.size / 2;
          if (newSize > 10) {
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
          }
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
      tension: 280,
      friction: 60,
      mass: 1,
      clamp: false,
      velocity: 0,
      precision: 0.1,
      duration: 500,
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

      const asteroidInterval = setInterval(moveAsteroid, 100);
      return () => clearInterval(asteroidInterval);
    }, [asteroid]);

    const asteroidStyle = useSpring({
      left: `${astPosition.x}px`,
      top: `${astPosition.y}px`,
      width: `${asteroid.size}px`,
      height: `${asteroid.size}px`,
      config: {
        tension: 120,
        friction: 14,
        mass: 1,
        clamp: false,
        velocity: 0,
        precision: 0.1,
        duration: 500,
      },
    });

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
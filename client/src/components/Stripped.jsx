import { useSpring, animated } from 'react-spring';
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter from 'matter-js';
 
const Stripped = () => {
  const [engine] = useState(Matter.Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false); // State to track game over
  const [ship, setShip] = useState(null);
  const gameRef = useRef();

  // Initialize Matter.js renderer
  useEffect(() => {
    engine.world.gravity.y = 0;

    const render = Matter.Render.create({
      element: gameRef.current,
      engine: engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false
      }
    });
    Matter.Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const shipBody = Matter.Bodies.rectangle(300, 300, 40, 40);
    setShip(shipBody);
    Matter.World.add(engine.world, shipBody);

    const cleanupFunctions = () => {
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };

    return cleanupFunctions;
  }, [engine]);

  // Handle ship movement and rotation
  const moveShipUp = () => {
    if (ship) {
      Matter.Body.setVelocity(ship, {
        x: ship.velocity.x + Math.cos(ship.angle) * 0.1,
        y: ship.velocity.y + Math.sin(ship.angle) * 0.1,
      });
    }
  };

  const rotateShipLeft = () => {
    if (ship) {
      Matter.Body.rotate(ship, -0.05);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Matter.Body.rotate(ship, 0.05);
    }
  };

  // Use react-hotkeys-hook to bind keys to functions
  useHotkeys('up', moveShipUp, [shipPosition]);
  useHotkeys('left', () => rotateShipLeft('left'), [shipPosition]);
  useHotkeys('right', () => rotateShipRight('right'), [shipPosition]);
  useHotkeys('space', shootProjectile, [shipPosition]);

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
    const gameLoop = () => {
      if (!gameOver) {
        updateGame();
        gameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(gameRef.current);
  }, [gameOver]);

  const updateGame = () => {
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
    const maxValue = axis === 'x' ? 1500 : 680; // Adjust game board dimensions
    const buffer = 30;
    if (value < -buffer) {
      return maxValue + buffer + value;
    } else if (value > maxValue + buffer) {
      return value - maxValue - buffer;
    }
    return value;
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
    const projectileRef = useRef(position);

    useEffect(() => {
      const updateProjectilePosition = () => {
        projectileRef.current = {
          ...projectileRef.current,
          x: wrapPosition(
            projectileRef.current.x + Math.sin(projectileRef.current.rotation * (Math.PI / 180)) * projectileRef.current.speed,
            'x'
          ),
          y: wrapPosition(
            projectileRef.current.y - Math.cos(projectileRef.current.rotation * (Math.PI / 180)) * projectileRef.current.speed,
            'y'
          ),
        };
      };

      const updateInterval = setInterval(updateProjectilePosition, 50); // Adjust interval as needed for smooth animation

      return () => clearInterval(updateInterval);
    }, []);

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

  return (
    <div className="game-board">
       {!gameOver && <animated.div className="ship" style={shipStyle}></animated.div>}
 
      {projectiles.map((projectile, index) => (
        <Projectile key={index} position={projectile} />
      ))}
    </div>
  );
};

export default Stripped;
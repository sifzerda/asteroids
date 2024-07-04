import { useSpring, animated } from 'react-spring';
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';
 
const Stripped = () => {
  const [engine] = useState(Engine.create({ gravity: { x: 0, y: 0 } }));
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const gameRef = useRef();

 // Initialize Matter.js renderer
 useEffect(() => {
  // Enable matter-wrap
  Matter.use(MatterWrap);

  // Create a renderer
  const render = Render.create({
    element: gameRef.current,
    engine: engine,
    options: {
      width: 1500,
      height: 680,
      wireframes: false
    }
  });
  Render.run(render);

  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

    // Define vertices for a triangular ship shape
    const vertices = [
      { x: 0, y: 0 },    // top point  
      { x: 50, y: 20 },    // bottom-right (ship front)
      { x: 0, y: 40 }      // bottom-left
    ];

    const shipBody = Bodies.fromVertices(750, 340, vertices, {
      plugin: {
        wrap: {
          min: { x: 0, y: 0 },
          max: { x: 1500, y: 680 }
        }
      }
    });

        // Rotate the ship to face 'moveup' direction
        Body.rotate(shipBody, -Math.PI / 2); // -90 degrees  

  setShip(shipBody);
  World.add(engine.world, shipBody);

  // Update ship position on every engine tick
  Events.on(engine, 'beforeUpdate', () => {
    setShipPosition({
      x: shipBody.position.x,
      y: shipBody.position.y,
      rotation: shipBody.angle * (180 / Math.PI) // Convert radians to degrees
    });
  });

  // Cleanup
  return () => {
    Render.stop(render);
    World.clear(engine.world);
    Engine.clear(engine);
  };
}, [engine]);

// Handle ship movement and rotation
const moveShipUp = () => {
  if (ship) {
    const forceMagnitude = 0.01; // Adjust force magnitude as needed
    const forceX = Math.cos(ship.angle) * forceMagnitude;
    const forceY = Math.sin(ship.angle) * forceMagnitude;

    Body.applyForce(ship, ship.position, { x: forceX, y: forceY });
  }
};

const rotateShipLeft = () => {
  if (ship) {
    Body.rotate(ship, -0.05);
  }
};

const rotateShipRight = () => {
  if (ship) {
    Body.rotate(ship, 0.05);
  }
};

const shootProjectile = () => {
  if (ship) {
    const speed = 10; // Adjust as needed
    const newProjectile = {
      body: Bodies.rectangle(ship.position.x, ship.position.y, 5, 5, {
        frictionAir: 0,
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: 1500, y: 680 }
          }
        }
      }),
      rotation: ship.angle,
      speed,
      lifetime: 100, // Adjust as needed
    };
    World.add(engine.world, newProjectile.body);
    setProjectiles(prevProjectiles => [...prevProjectiles, newProjectile]);
  }
};

// Use react-hotkeys-hook to bind keys to functions
useHotkeys('up', moveShipUp, [ship]);
useHotkeys('left', rotateShipLeft, [ship]);
useHotkeys('right', rotateShipRight, [ship]);
useHotkeys('space', shootProjectile, [ship]);

// Update projectiles
useEffect(() => {
  const gameLoop = () => {
    if (!gameOver) {
      updateGame();
      requestAnimationFrame(gameLoop);
    }
  };

  requestAnimationFrame(gameLoop);

  return () => cancelAnimationFrame(gameRef.current);
}, [gameOver]);

const updateGame = () => {
  // Update projectiles using Matter.js physics
  projectiles.forEach(projectile => {
    Body.translate(projectile.body, {
      x: Math.sin(projectile.rotation) * projectile.speed,
      y: -Math.cos(projectile.rotation) * projectile.speed
    });
  });

  // Remove projectiles that have expired or moved out of bounds
  setProjectiles(prevProjectiles =>
    prevProjectiles.filter(projectile =>
      projectile.lifetime > 0 &&
      projectile.body.position.x > 0 && projectile.body.position.x < 1500 &&
      projectile.body.position.y > 0 && projectile.body.position.y < 680
    )
  );
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

const shipStyle = useSpring({
  left: `${shipPosition.x}px`,
  top: `${shipPosition.y}px`,
  transform: `rotate(${shipPosition.rotation}deg)`,
  config: {
    tension: 100,    // Adjust tension for the ship's movement responsiveness
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
  <div className="game-board" ref={gameRef}>
    {!gameOver && <animated.div className="ship" style={shipStyle}></animated.div>}
    {projectiles.map((projectile, index) => (
      <Projectile key={index} position={projectile} />
    ))}
  </div>
);
};

export default Stripped;
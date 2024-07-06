import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Stripped = () => {
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [asteroids, setAsteroids] = useState([]); // State for asteroids
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15); // Initial rotation speed
  
  const gameRef = useRef();

  useEffect(() => {
    // Enable matter-wrap
    Matter.use(MatterWrap);

    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false
      }
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const vertices = [
      { x: 0, y: 0 },    // top point  
      { x: 34, y: 14 },    // bottom-right (ship front)
      { x: 0, y: 27 }      // bottom-left
    ];

const shipBody = Bodies.fromVertices(750, 340, vertices, {
  render: {
    fillStyle: 'transparent', // Make the fill transparent
    strokeStyle: '#ffffff', // White border
    lineWidth: 2 // Border width
  },
  plugin: {
    wrap: {
      min: { x: 0, y: 0 },
      max: { x: 1500, y: 680 }
    }
  }
});

    Body.rotate(shipBody, -Math.PI / 2); // -90 degrees  
    setShip(shipBody);
    World.add(engine.world, shipBody);

 //////////////////////////////////////////////////

    // Function to create random vertices for asteroids
    const randomVertices = (numVertices, radius) => {
      const vertices = [];
      for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const x = Math.cos(angle) * (radius * (0.8 + Math.random() * 0.4));
        const y = Math.sin(angle) * (radius * (0.8 + Math.random() * 0.4));
        vertices.push({ x, y });
      }
      return vertices;
    };

// Create a couple of asteroids
    // Function to create asteroids with random positions and velocities
    const createAsteroids = () => {
      const numberOfAsteroids = 5;
      const newAsteroids = [];

      for (let i = 0; i < numberOfAsteroids; i++) {
        const radius = Math.random() * 30 + 80; // Random radius between 20 and 50
        const numVertices = Math.floor(Math.random() * 5) + 5; // Random number of vertices between 5 and 10
        const vertices = randomVertices(numVertices, radius);
        const startX = Math.random() * 1500; // Random x position
        const startY = Math.random() * 680; // Random y position
        const velocityX = (Math.random() - 0.5) * 4; // Random velocity x between -2 and 2
        const velocityY = (Math.random() - 0.5) * 4; // Random velocity y between -2 and 2

        const asteroid = Bodies.fromVertices(startX, startY, vertices, {
          frictionAir: 0, // No air resistance, for inertia
          render: {
            fillStyle: 'transparent', // Make the fill transparent 
            strokeStyle: '#ffffff', // White border
            lineWidth: 2 // Border width
          },
          plugin: {
            wrap: {
              min: { x: 0, y: 0 },
              max: { x: 1500, y: 680 }
            }
          }
        });
        Body.setVelocity(asteroid, { x: velocityX, y: velocityY });
        newAsteroids.push(asteroid);
        World.add(engine.world, asteroid);
      }
      setAsteroids(newAsteroids);
    };
    createAsteroids();

 //////////////////////////////////////////////////

    const updateShipPosition = () => {
      setShipPosition({
        x: shipBody.position.x,
        y: shipBody.position.y,
        rotation: shipBody.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateShipPosition);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateShipPosition);
    };
  }, [engine]);

  // Function to move ship up
  const moveShipUp = () => {
    if (ship) {
      const forceMagnitude = 0.0003; // 
      const forceX = Math.cos(ship.angle) * forceMagnitude;
      const forceY = Math.sin(ship.angle) * forceMagnitude;
      Body.applyForce(ship, ship.position, { x: forceX, y: forceY });
    }
  };

  // Function to rotate ship left
  const rotateShipLeft = () => {
    if (ship) {
      Body.rotate(ship, -rotationSpeed);
    }
  };

  // Function to rotate ship right
  const rotateShipRight = () => {
    if (ship) {
      Body.rotate(ship, rotationSpeed);
    }
  };

  ////////////////////////////////////////////////////////

 

///////////////////////////////////////////////////////////////////

  // Function to shoot projectile
  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const offset = 40; // Offset distance from the ship to avoid affecting ship motion
      const projectileX = ship.position.x + Math.cos(ship.angle) * offset;
      const projectileY = ship.position.y + Math.sin(ship.angle) * offset;
      const projectileBody = Bodies.rectangle(projectileX, projectileY, 15, 3, { // Change dimensions here
        frictionAir: 0.01, // Adjust air resistance
        angle: ship.angle, // Set the angle of the projectile to match the ship
        render: {
          fillStyle: '#00FFDC' // cyan
        },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: 1500, y: 680 }
          }
        }
      });
      const velocityX = Math.cos(ship.angle) * speed;
      const velocityY = Math.sin(ship.angle) * speed;
      Body.setVelocity(projectileBody, { x: velocityX, y: velocityY });
  
      const newProjectile = {
        body: projectileBody,
        rotation: ship.angle,
        lifetime: 100,
      };
      World.add(engine.world, projectileBody);
      setProjectiles(prev => [...prev, newProjectile]);
  
      // Remove the projectile after 2 seconds (2 seconds)
      setTimeout(() => {
        World.remove(engine.world, projectileBody);
        setProjectiles(prev => prev.filter(proj => proj.body !== projectileBody));
      }, 2000);
    }
  };

  // Hotkeys for ship controls
  useHotkeys('up', moveShipUp, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
  useHotkeys('space', shootProjectile, [ship]);

  // Game loop effect
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

  // Function to update game state
  const updateGame = () => {
    // Update projectile positions
    projectiles.forEach(projectile => {
      Body.translate(projectile.body, {
        x: Math.sin(projectile.rotation) * projectile.speed,
        y: -Math.cos(projectile.rotation) * projectile.speed
      });
    });

    // Remove off-screen projectiles
    setProjectiles(prev => (
      prev.filter(projectile =>
        projectile.lifetime > 0 &&
        projectile.body.position.x > 0 && projectile.body.position.x < 1500 &&
        projectile.body.position.y > 0 && projectile.body.position.y < 680
      )
    ));

    // Remove off-screen asteroids
    setAsteroids(prev => (
      prev.filter(asteroid =>
        asteroid.position.x > 0 && asteroid.position.x < 1500 &&
        asteroid.position.y > 0 && asteroid.position.y < 680
      )
    ));

  };

  // Spring animation for ship
  const shipStyle = useSpring({
    left: `${shipPosition.x}px`,
    top: `${shipPosition.y}px`,
    transform: `rotate(${shipPosition.rotation}deg)`,
    config: {
      tension: 100,
      friction: 60,
      mass: 1,
      clamp: false,
      velocity: 0,
      precision: 0.1,
      duration: 500,
    },
  });

  // Component for projectile
  const Projectile = ({ position }) => {
    const projectileStyle = useSpring({
      left: `${position.x}px`,
      top: `${position.y}px`,
      // fire orientation match ship:
      transform: `rotate(${position.body.angle}rad)`, // Use radians for rotation
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

// Component for asteroid
const Asteroid = ({ position }) => {
  const asteroidStyle = useSpring({
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${position.angle}rad)`,
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

  return <animated.div className="asteroids" style={asteroidStyle}></animated.div>;
};

  // Return JSX for game board
  return (
    <div className="game-board" ref={gameRef}>
      {!gameOver && <animated.div className="ship" style={shipStyle}></animated.div>}
      {projectiles.map((projectile, index) => (
        <Projectile key={index} position={projectile} />
      ))}
      {asteroids.map((asteroid, index) => (
        <Asteroid key={index} position={asteroid.position} />
      ))}
    </div>
  );
};

export default Stripped;
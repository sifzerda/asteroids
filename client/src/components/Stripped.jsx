import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Stripped = () => {
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]); // State for exhaust particles
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15); // Initial rotation speed
  
  const gameRef = useRef();

  const MAX_PARTICLES = 1; // Maximum number of exhaust particles (1-2 preferred for performance)

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

    Body.rotate(shipBody, -Math.PI / 2); // -90 degrees  

    setShip(shipBody);
    World.add(engine.world, shipBody);

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
      const forceMagnitude = 0.001;
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

  // Function to shoot projectile
  const shootExhaust = () => {
    if (ship) {
      const exhaustCount = 5; // Number of exhaust particles to emit
      const speed = -2;
      const offset = -30; // Offset distance from the ship to avoid affecting ship motion
      const spreadAngle = 0.2; // Angle in radians to spread particles

      const newParticles = [];

      for (let i = 0; i < exhaustCount; i++) {
        const spreadOffset = (i - (exhaustCount - 1) / 2) * spreadAngle; // Calculate spread based on particle index
        const particleX = ship.position.x + Math.cos(ship.angle) * offset;
        const particleY = ship.position.y + Math.sin(ship.angle) * offset;
        const particleBody = Bodies.circle(particleX, particleY, 1, {
          frictionAir: 0.02, // Adjust air resistance
          restitution: 0.4, // Bounciness
          render: {
            fillStyle: '#ff0000' // red exhaust
          },
          plugin: {
            wrap: {
              min: { x: 0, y: 0 },
              max: { x: 1500, y: 680 }
            }
          }
        });

const velocityX = Math.cos(ship.angle + spreadOffset) * speed + (Math.random() - 0.5) * 0.5; // Add slight random variation to jetspray
      const velocityY = Math.sin(ship.angle + spreadOffset) * speed + (Math.random() - 0.5) * 0.5;
      Body.setVelocity(particleBody, { x: velocityX, y: velocityY });

      const newParticle = {
        body: particleBody,
        rotation: ship.angle,
        lifetime: 100 // 
      };
      World.add(engine.world, particleBody);
 
      newParticles.push(newParticle);

        // Remove the particle after its lifetime
        setTimeout(() => {
          World.remove(engine.world, particleBody);
          setParticles(prev => prev.filter(p => p.body !== particleBody));
        }, newParticle.lifetime);
      }

      setParticles(prev => {
        const combinedParticles = [...prev, ...newParticles];
        if (combinedParticles.length > MAX_PARTICLES) {
          return combinedParticles.slice(combinedParticles.length - MAX_PARTICLES);
        }
        return combinedParticles;
      });
    }
  };

///////////////////////////////////////////////////////////////////

  // Function to shoot projectile
  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const offset = 40; // Offset distance from the ship to avoid affecting ship motion
      const projectileX = ship.position.x + Math.cos(ship.angle) * offset;
      const projectileY = ship.position.y + Math.sin(ship.angle) * offset;
      const projectileBody = Bodies.rectangle(projectileX, projectileY, 5, 5, {
        frictionAir: 0.01, // Adjust air resistance
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
  useHotkeys('up', shootExhaust, [ship]); ////////////////////////////////////
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

    particles.forEach(particle => {
      Body.translate(particle.body, {
        x: Math.sin(particle.rotation) * particle.speed,
        y: -Math.cos(particle.rotation) * particle.speed
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

    setParticles(prev => (
      prev.filter(particle =>
        particle.lifetime > 0 &&
        particle.body.position.x > 0 && particle.body.position.x < 1500 &&
        particle.body.position.y > 0 && particle.body.position.y < 680
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

  // Component for particle
  const Particle = ({ position }) => {
    const particleStyle = useSpring({
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

    return <animated.div className="particle-exhaust" style={particleStyle}></animated.div>;
  };
 

  // Return JSX for game board
  return (
    <div className="game-board" ref={gameRef}>
      {!gameOver && <animated.div className="ship" style={shipStyle}></animated.div>}
      {projectiles.map((projectile, index) => (
        <Projectile key={index} position={projectile} />
      ))}
       {particles.map((particle, index) => (
        <Particle key={index} position={particle} />
      ))}
    </div>
  );
};

export default Stripped;
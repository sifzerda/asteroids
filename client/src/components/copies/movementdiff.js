// this has a useEffect for MoveShipUp so it can be called when the up key is pressed
// makes movement happen from once key is pressed

import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Stripped = () => {
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));

//  const [engine] = useState(() => {
///    const newEngine = Engine.create({ gravity: { x: 0, y: 0 } });
//    newEngine.velocityIterations = 10; // Increase velocity iterations
//    newEngine.positionIterations = 10; // Increase position iterations
//    return newEngine;
//  });

  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15); // Initial rotation speed
  const [movingUp, setMovingUp] = useState(false); // Track if "up" key is pressed
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

useEffect(() => {
    const applyForce = () => {
      if (movingUp && ship) {
        const forceMagnitude = 0.0005; // Smaller force for smoother acceleration
        const forceX = Math.cos(ship.angle) * forceMagnitude;
        const forceY = Math.sin(ship.angle) * forceMagnitude;
        Body.applyForce(ship, ship.position, { x: forceX, y: forceY });
      }
      requestAnimationFrame(applyForce);
    };
    applyForce();
  }, [movingUp, ship]);

  const rotateShipLeft = () => {
    if (ship) {
      Body.rotate(ship, -rotationSpeed);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Body.rotate(ship, rotationSpeed);
    }
  };

  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const projectileBody = Bodies.rectangle(ship.position.x, ship.position.y, 5, 5, {
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
    }
  };

  useHotkeys('up', () => setMovingUp(true), { keyup: () => setMovingUp(false) }, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
  useHotkeys('space', shootProjectile, [ship]);

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
    projectiles.forEach(projectile => {
      Body.translate(projectile.body, {
        x: Math.sin(projectile.rotation) * projectile.speed,
        y: -Math.cos(projectile.rotation) * projectile.speed
      });
    });

    setProjectiles(prev => (
      prev.filter(projectile =>
        projectile.lifetime > 0 &&
        projectile.body.position.x > 0 && projectile.body.position.x < 1500 &&
        projectile.body.position.y > 0 && projectile.body.position.y < 680
      )
    ));
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
      tension: 100, // spring speed
      friction: 60, // spring dampening
      mass: 1, // mass of the object
      clamp: false, // whether to stop at the end value
      velocity: 0, // initial velocity
      precision: 0.1, // precision
      duration: 500, // duration of the animation
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

      const updateInterval = setInterval(updateProjectilePosition, 50);

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



/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

// PRECISE, SHORT, SHARP SHIP MOVEMENT

import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Stripped = () => {
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
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
      { x: 50, y: 20 },    // bottom-right (ship front)
      { x: 0, y: 40 }      // bottom-left
    ];

    const shipBody = Bodies.fromVertices(750, 340, vertices, {
      frictionAir: 0.09, // Set initial air friction for smooth deceleration
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

  const applyForceToShip = () => {
    if (ship) {
      const forceMagnitude = 0.005; // Smaller force for smoother acceleration
      const forceX = Math.cos(ship.angle) * forceMagnitude;
      const forceY = Math.sin(ship.angle) * forceMagnitude;
      Body.applyForce(ship, ship.position, { x: forceX, y: forceY });
    }
  };

  const rotateShipLeft = () => {
    if (ship) {
      Body.rotate(ship, -rotationSpeed);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Body.rotate(ship, rotationSpeed);
    }
  };

  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const projectileBody = Bodies.rectangle(ship.position.x, ship.position.y, 5, 5, {
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
    }
  };

  useHotkeys('up', applyForceToShip, { keyup: () => setMovingUp(false) }, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
  useHotkeys('space', shootProjectile, [ship]);

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
    projectiles.forEach(projectile => {
      Body.translate(projectile.body, {
        x: Math.sin(projectile.rotation) * projectile.speed,
        y: -Math.cos(projectile.rotation) * projectile.speed
      });
    });

    setProjectiles(prev => (
      prev.filter(projectile =>
        projectile.lifetime > 0 &&
        projectile.body.position.x > 0 && projectile.body.position.x < 1500 &&
        projectile.body.position.y > 0 && projectile.body.position.y < 680
      )
    ));
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
      tension: 100, // spring speed
      friction: 60, // spring dampening
      mass: 1, // mass of the object
      clamp: false, // whether to stop at the end value
      velocity: 0, // initial velocity
      precision: 0.1, // precision
      duration: 500, // duration of the animation
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

      const updateInterval = setInterval(updateProjectilePosition, 50);

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
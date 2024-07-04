import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const AsteroidsGame = () => {
  const [engine] = useState(Matter.Engine.create());
  const [ship, setShip] = useState(null);
  
  const gameRef = useRef();

  // Initialize Matter.js renderer
  useEffect(() => {
    Matter.use(MatterWrap);
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

    const shipBody = Matter.Bodies.rectangle(300, 300, 40, 40, {
      frictionAir: 0.05, // Air resistance to simulate inertia
    });
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
  const moveShip = () => {
    if (ship) {
      const angle = ship.angle;
      const accelerationMagnitude = 0.0005; // Adjust as needed for speed
      const forceX = accelerationMagnitude * Math.cos(angle);
      const forceY = accelerationMagnitude * Math.sin(angle);
      
      // Apply forward acceleration force
      Matter.Body.applyForce(ship, ship.position, {
        x: forceX,
        y: forceY
      });

      // Apply rotational velocity
      Matter.Body.setAngularVelocity(ship, ship.angularVelocity * 0.95); // Damping angular velocity
      
      // Apply centrifugal force
      applyCentrifugalForce(ship);
    }
  };

  const rotateShipLeft = () => {
    if (ship) {
      Matter.Body.setAngularVelocity(ship, -0.05);
      applyCentrifugalForce(ship);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Matter.Body.setAngularVelocity(ship, 0.05);
      applyCentrifugalForce(ship);
    }
  };

  const applyCentrifugalForce = (body) => {
    const centrifugalForceMagnitude = 0.005;
    const position = body.position;
    const velocity = body.velocity;
    const angle = body.angle - Math.PI / 2; // Perpendicular to ship's angle

    Matter.Body.applyForce(body, position, {
      x: centrifugalForceMagnitude * Math.cos(angle) * -velocity.x,
      y: centrifugalForceMagnitude * Math.sin(angle) * -velocity.y
    });
  };

  // Use react-hotkeys-hook to bind keys to functions
  useHotkeys('up', moveShip);
  useHotkeys('left', rotateShipLeft);
  useHotkeys('right', rotateShipRight);

  // Wrapping ship's position
  useEffect(() => {
    if (ship) {
      Events.on(engine, 'beforeUpdate', () => {
        Body.setPosition(ship, {
          x: wrapPosition(ship.position.x, 'x'),
          y: wrapPosition(ship.position.y, 'y')
        });
      });
    }
  }, [engine, ship]);

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

  return (
    <div className="game-board" ref={gameRef} />
  );
};

export default AsteroidsGame;
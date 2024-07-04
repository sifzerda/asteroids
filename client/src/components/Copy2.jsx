import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';

const Copy2 = () => {
  const [engine] = useState(Matter.Engine.create());
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
  const moveShipUp = () => {
    if (ship) {
      const angle = ship.angle;
      const forceMagnitude = 0.01; // Adjust as needed for speed
      Matter.Body.applyForce(ship, ship.position, {
        x: forceMagnitude * Math.cos(angle),
        y: forceMagnitude * Math.sin(angle)
      });
    }
  };

  const rotateShipLeft = () => {
    if (ship) {
      Matter.Body.setAngularVelocity(ship, -0.05);
    }
  };

  const rotateShipRight = () => {
    if (ship) {
      Matter.Body.setAngularVelocity(ship, 0.05);
    }
  };

  // Use react-hotkeys-hook to bind keys to functions
  useHotkeys('up', moveShipUp);
  useHotkeys('left', rotateShipLeft);
  useHotkeys('right', rotateShipRight);

  return (
    <div className="game-board" ref={gameRef} />
  );
};

export default Copy2;
import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { useHotkeys } from 'react-hotkeys-hook';

const Copy2 = () => {
  const [engine] = useState(Matter.Engine.create());
  const [ship, setShip] = useState(null);
  
  const gameRef = useRef();

  useEffect(() => {
    // Disable gravity
    engine.world.gravity.y = 0;

    // Initialize Matter.js renderer
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

    // Initialize Matter.js runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create ship
    const shipBody = Matter.Bodies.rectangle(300, 300, 40, 40);
    setShip(shipBody);
    Matter.World.add(engine.world, shipBody);

    // Cleanup functions
    const cleanupFunctions = () => {
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };

    // Handle keyboard input using react-hotkeys-hook
    useHotkeys('up', () => {
      Matter.Body.setVelocity(shipBody, {
        x: shipBody.velocity.x + Math.cos(shipBody.angle) * 0.1,
        y: shipBody.velocity.y + Math.sin(shipBody.angle) * 0.1,
      });
    });

    useHotkeys('left', () => {
      Matter.Body.rotate(shipBody, -0.05);
    });

    useHotkeys('right', () => {
      Matter.Body.rotate(shipBody, 0.05);
    });

    // Cleanup
    return cleanupFunctions;
  }, [engine]);

  return (
    <div className="game-board" ref={gameRef} />
  );
};

export default Copy2;
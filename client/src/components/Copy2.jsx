// + moving ship
// + ship rotates around a circular axis (rather than in place)
// + asteroids move
// + projectile fire
// - collision detection

import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';

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

    // Handle keyboard input
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          Matter.Body.setVelocity(shipBody, {
            x: shipBody.velocity.x + Math.cos(shipBody.angle) * 0.1,
            y: shipBody.velocity.y + Math.sin(shipBody.angle) * 0.1,
          });
          break;
        case 'ArrowLeft':
          Matter.Body.rotate(shipBody, -0.05);
          break;
        case 'ArrowRight':
          Matter.Body.rotate(shipBody, 0.05);
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };
  }, [engine]);

  return (
    <div className="game-board" ref={gameRef} />
  );
};

export default Copy2;
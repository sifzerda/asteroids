// + moving ship
// + ship rotates around a circular axis (rather than in place)
// + asteroids move
// + projectile fire
// - collision detection

import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';

const Copy = () => {
  const [engine] = useState(Matter.Engine.create());
  const [ship, setShip] = useState(null);
  const [asteroids, setAsteroids] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  
  const gameRef = useRef();

  useEffect(() => {
    // Disable gravity
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

    // Add walls
    const walls = [
      Matter.Bodies.rectangle(750, 0, 1500, 30, { isStatic: true }),
      Matter.Bodies.rectangle(750, 680, 1500, 30, { isStatic: true }),
      Matter.Bodies.rectangle(0, 340, 30, 680, { isStatic: true }),
      Matter.Bodies.rectangle(1500, 340, 30, 680, { isStatic: true }),
    ];

    Matter.World.add(engine.world, walls);

    const ship = Matter.Bodies.rectangle(300, 300, 40, 40);
    setShip(ship);
    Matter.World.add(engine.world, ship);

    const initialAsteroids = [
      Matter.Bodies.circle(100, 100, 50, { velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 } }),
      Matter.Bodies.circle(400, 200, 50, { velocity: { x: (Math.random() * 2 - 1) * 2, y: (Math.random() * 2 - 1) * 2 } }),
    ];

    setAsteroids(initialAsteroids);
    Matter.World.add(engine.world, initialAsteroids);

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          Matter.Body.setVelocity(ship, {
            x: ship.velocity.x + Math.cos(ship.angle) * 0.1,
            y: ship.velocity.y + Math.sin(ship.angle) * 0.1,
          });
          break;
        case 'ArrowLeft':
          Matter.Body.rotate(ship, -0.05);
          break;
        case 'ArrowRight':
          Matter.Body.rotate(ship, 0.05);
          break;
        case ' ':
          shootProjectile();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    };
  }, [engine]);

  const shootProjectile = () => {
    if (!ship) return;

    const speed = 10;
    const projectile = Matter.Bodies.circle(
      ship.position.x + Math.cos(ship.angle) * 20,
      ship.position.y + Math.sin(ship.angle) * 20,
      5,
      { velocity: { x: Math.cos(ship.angle) * speed, y: Math.sin(ship.angle) * speed } }
    );

    setProjectiles((prevProjectiles) => [...prevProjectiles, projectile]);
    Matter.World.add(engine.world, projectile);
  };

  return (
    <div className="game-board" ref={gameRef} />
  );
};

export default Copy;
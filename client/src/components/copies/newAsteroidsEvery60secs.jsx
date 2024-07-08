
//====================================================================================//
//       THIS HAS CODE WHICH SPAWNS NEW ASTEROIDS EVERY 60 SECS                       //
//====================================================================================//


import { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, World, Bodies, Body } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const Stripped = () => {
  const [engine] = useState(Engine.create());
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [asteroidSizes, setAsteroidSizes] = useState([]);
  const [asteroidHits, setAsteroidHits] = useState([]);
  const [score, setScore] = useState(0); // Initialize score at 0
  const [level, setLevel] = useState(1); // Initialize level at 1


  const gameRef = useRef();

  window.decomp = decomp; // poly-decomp is available globally

//------------------------------------------------------------------------------------//

  // Helper function to generate random vertices for asteroids
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

  // Function to create asteroids
  const createAsteroids = () => {
    const asteroidRadii = [80, 100, 120, 140, 160];
    const numberOfAsteroids = 5;
    const newAsteroids = [];
    const newAsteroidSizes = [];
    const newAsteroidHits = [];

    for (let i = 0; i < numberOfAsteroids; i++) {
      const radiusIndex = Math.floor(Math.random() * asteroidRadii.length);
      const radius = asteroidRadii[radiusIndex];
      newAsteroidSizes.push(radius);
      newAsteroidHits.push(0);

      const numVertices = Math.floor(Math.random() * 5) + 5;
      const vertices = randomVertices(numVertices, radius);

      const startX = Math.random() * 3000 - 750;
      const startY = Math.random() * 1700 - 340;

      const velocityX = (Math.random() - 0.5) * 4;
      const velocityY = (Math.random() - 0.5) * 4;

      const asteroid = Bodies.fromVertices(startX, startY, vertices, {
        frictionAir: 0,
        render: {
          fillStyle: 'transparent',
          strokeStyle: '#ffffff',
          lineWidth: 2,
        },
        plugin: {
          wrap: {
            min: { x: 0, y: 0 },
            max: { x: 1500, y: 680 },
          },
        },
      });

      Body.setVelocity(asteroid, { x: velocityX, y: velocityY });
      Body.setAngularVelocity(asteroid, 0.01);
      newAsteroids.push(asteroid);
      World.add(engine.world, asteroid);
    }

    setAsteroids(newAsteroids);
    setAsteroidSizes(newAsteroidSizes);
    setAsteroidHits(newAsteroidHits);
  };

  // Initial creation of asteroids and setup
  useEffect(() => {
    Matter.use(MatterWrap);
    engine.world.gravity.y = 0;
    const render = Render.create({
      element: gameRef.current,
      engine,
      options: {
        width: 1500,
        height: 680,
        wireframes: false,
      },
    });
    Render.run(render);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Create asteroids initially
    createAsteroids();

    // Interval to replace asteroids every 10 seconds
    const intervalId = setInterval(createAsteroids, 10000);

    return () => {
      clearInterval(intervalId);
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [engine]);

  // Continuous score increment
  useEffect(() => {
    const scoreInterval = setInterval(() => {
      if (!gameOver) {
        setScore((prevScore) => prevScore + 1);
      }
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [gameOver]);

  return (
    <div className="game-container" ref={gameRef}>
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over">Game Over</div>
        </div>
      )}
      <div className="score-display">Score: {score}</div>
      <div className="level-display">Level: {level}</div>
      <div className="lives-display"></div>
    </div>
  );
};

export default Stripped;
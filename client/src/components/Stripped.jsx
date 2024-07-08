
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

import StartScreen from './StartScreen'; 
import FinalScore from './FinalScore'; 
import HighScores from './HighScores'; 

const Asteroids = () => {
  const [engine] = useState(Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const [asteroidSizes, setAsteroidSizes] = useState([]);
  const [asteroidHits, setAsteroidHits] = useState([]);
  const [score, setScore] = useState(0); // Initialize score at 0
  const [lives, setLives] = useState(3); // Initialize lives at 3
  const [destroyedAsteroids, setDestroyedAsteroids] = useState(0); // Initialize destroyed asteroids count down to 0

  const [startGame, setStartGame] = useState(false); // State to track game start
  const [gameOver, setGameOver] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);

  const gameRef = useRef();

  window.decomp = decomp; // poly-decomp is available globally

  //---------------------------------// START SCREENS //-----------------------------------//

  const startGameHandler = () => {
    setStartGame(true);
  };

  const showHighScorePage = () => {
    setShowHighScores(true);
  };

//------------------------------------------------------------------------------------//

//---// helper function to generate random vertices for generated asteroids //-------//
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

    //---------------------------------// ASTEROIDS //-----------------------------------//
const createAsteroid = () => {
  const asteroidRadii = [80, 100, 120, 140, 160];
  const radiusIndex = Math.floor(Math.random() * asteroidRadii.length);
  const radius = asteroidRadii[radiusIndex];
  const numVertices = Math.floor(Math.random() * 5) + 5;
  const vertices = randomVertices(numVertices, radius);

  // Randomize starting position anywhere outside the visible screen
  const startX = Math.random() * 3000 - 750;
  const startY = Math.random() * 1700 - 340;

  // Randomize velocity direction and speed
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
  Body.setAngularVelocity(asteroid, 0.01); // Adjust angular velocity as needed
  setAsteroids((prev) => [...prev, asteroid]);
  setAsteroidSizes((prev) => [...prev, radius]);
  setAsteroidHits((prev) => [...prev, 0]);
  World.add(engine.world, asteroid);
};

//------------------------// SET UP MATTER.JS GAME OBJECTS //-------------------------//
  useEffect(() => {

if (startGame) {

    Matter.use(MatterWrap);
    engine.world.gravity.y = 0;
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
      { x: 0, y: 0 },
      { x: 34, y: 14 },
      { x: 0, y: 27 }
    ];

    const shipBody = Bodies.fromVertices(750, 340, vertices, {
      frictionAir: 0.02,
      restitution: 0,
      friction: 0.02,
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff', 
        lineWidth: 2,
        visible: true // Conditional visibility
      },
      plugin: {
        wrap: {
          min: { x: 0, y: 0 },
          max: { x: 1500, y: 680 }
        }
      }
    });
    Body.rotate(shipBody, -Math.PI / 2);

    setShip(shipBody);
    World.add(engine.world, shipBody);

// Create initial asteroids
for (let i = 0; i < 5; i++) {
  createAsteroid();
}
    // Set up an interval to create new asteroids every 20 seconds
    const intervalId = setInterval(createAsteroid, 20000);

    const updateShipPosition = () => {
      setShipPosition({
        x: shipBody.position.x,
        y: shipBody.position.y,
        rotation: shipBody.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateShipPosition);

    return () => {
      clearInterval(intervalId);
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateShipPosition);
    };
  }}, [startGame]);

  const moveShipUp = () => {
    if (ship) {
      const forceMagnitude = 0.0005;
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

  // --------------------------------// HOTKEYS //-----------------------------------//

  useHotkeys('up', moveShipUp, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);

  // Handling asteroid and projectile collisions:
  useEffect(() => {
    const handleCollisions = (event) => {
      const pairs = event.pairs;

      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const isProjectileA = projectiles.find(proj => proj.body === bodyA);
        const isProjectileB = projectiles.find(proj => proj.body === bodyB);
        const isAsteroidA = asteroids.find(ast => ast === bodyA);
        const isAsteroidB = asteroids.find(ast => ast === bodyB);

        if (isProjectileA && isAsteroidB) {
          handleAsteroidCollision(bodyA, bodyB);
        } else if (isProjectileB && isAsteroidA) {
          handleAsteroidCollision(bodyB, bodyA);
        }
      });
    };

    const handleAsteroidCollision = (projectile, asteroid) => {
      // Remove the projectile
      World.remove(engine.world, projectile);
      setProjectiles(prev => prev.filter(proj => proj.body !== projectile));

//------------------------// HIT ASTEROID SPLITTING // ---------------------------------//
      // Get index of the asteroid
      const asteroidIndex = asteroids.findIndex(ast => ast === asteroid);
      if (asteroidIndex !== -1) {
        // Increment hit count for the asteroid
        const currentHits = asteroidHits[asteroidIndex] + 1;
        const updatedHits = [...asteroidHits];
        updatedHits[asteroidIndex] = currentHits;
        setAsteroidHits(updatedHits);

               // Increment score
               setScore(prevScore => prevScore + 10); // Adjust score increment as needed
  
        // Check if asteroid should be removed
        if (currentHits >= 2) {
          // Remove the asteroid
          World.remove(engine.world, asteroid);
          setAsteroids(prev => prev.filter(ast => ast !== asteroid));
          setAsteroidSizes(prev => prev.filter((size, idx) => idx !== asteroidIndex));
          setAsteroidHits(prev => prev.filter((hits, idx) => idx !== asteroidIndex));

                    // Update the destroyed asteroids count and replace asteroids if needed
                    setDestroyedAsteroids((prev) => prev + 1);

                    if (destroyedAsteroids + 1 === 5) {

                      setDestroyedAsteroids(0);
                    }
        } else {
          // Split the asteroid into smaller ones
          const asteroidRadius = asteroidSizes[asteroidIndex];
          const newRadius = asteroidRadius / 2;

          if (newRadius > 20) { // Ensure the new asteroids are not too small
            const vertices = randomVertices(Math.floor(Math.random() * 5) + 5, newRadius);
            const { x: asteroidX, y: asteroidY } = asteroid.position;
            const velocityX = (Math.random() - 0.5) * 4;
            const velocityY = (Math.random() - 0.5) * 4;
  
            const newAsteroid1 = Bodies.fromVertices(asteroidX, asteroidY, vertices, {
              frictionAir: 0,
              render: {
                fillStyle: 'transparent',
                strokeStyle: '#ffffff',
                lineWidth: 2
              },
              plugin: {
                wrap: {
                  min: { x: 0, y: 0 },
                  max: { x: 1500, y: 680 }
                }
              }
            });
            Body.setVelocity(newAsteroid1, { x: velocityX, y: velocityY });
            World.add(engine.world, newAsteroid1);
            setAsteroids(prev => [...prev, newAsteroid1]);
            setAsteroidSizes(prev => [...prev, newRadius]);
            setAsteroidHits(prev => [...prev, 0]);
  
            const newAsteroid2 = Bodies.fromVertices(asteroidX, asteroidY, vertices, {
              frictionAir: 0,
              render: {
                fillStyle: 'transparent',
                strokeStyle: '#ffffff',
                lineWidth: 2
              },
              plugin: {
                wrap: {
                  min: { x: 0, y: 0 },
                  max: { x: 1500, y: 680 }
                }
              }
            });
            Body.setVelocity(newAsteroid2, { x: -velocityX, y: -velocityY });
            World.add(engine.world, newAsteroid2);
            setAsteroids(prev => [...prev, newAsteroid2]);
            setAsteroidSizes(prev => [...prev, newRadius]);
            setAsteroidHits(prev => [...prev, 0]);
          }
        }
      }
    };

    Events.on(engine, 'collisionStart', handleCollisions);

    return () => {
      Events.off(engine, 'collisionStart', handleCollisions);
    };
  }, [engine, projectiles, asteroids, asteroidSizes, asteroidHits]);

  //---------------------------------- // CRASH HANDLING //---------------------------------------//

  useEffect(() => {
    const handleCollisions = (event) => {
      const pairs = event.pairs;
  
      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
  
        const isShipA = bodyA === ship;
        const isShipB = bodyB === ship;
        const isAsteroidA = asteroids.find(ast => ast === bodyA);
        const isAsteroidB = asteroids.find(ast => ast === bodyB);
  
        if ((isShipA && isAsteroidB) || (isShipB && isAsteroidA)) {
//----------------------------------- expel ship parts --------------------------------------------//
          const emitCrash = (shipBody) => {
            const pieceCount = 10;
            const pieceSpeed = 10;
            const pieceSpread = 4;
          
            for (let i = 0; i < pieceCount; i++) {
              const pieceX = shipBody.position.x + (Math.random() - 0.5) * 10;
              const pieceY = shipBody.position.y + (Math.random() - 0.5) * 10;
          
              // Generate random number of vertices
              const numVertices = Math.floor(Math.random() * 5) + 5;
              const vertices = [];
              for (let j = 0; j < numVertices; j++) {
                const angle = (j / numVertices) * Math.PI * 2;
                const radius = 2 + Math.random() * 20; // Adjust radius as needed
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                vertices.push({ x, y });
              }
          // ship parts:
              const pieceBody = Bodies.fromVertices(pieceX, pieceY, vertices, {
                frictionAir: 0,
                restitution: 0.4,
                render: {
                  fillStyle: 'transparent', // Transparent fill
                  strokeStyle: '#ffffff', // Outline color
                  lineWidth: 2 // Outline width
                },
                plugin: {
                  wrap: {
                    min: { x: 0, y: 0 },
                    max: { x: 1500, y: 680 }
                  }
                }
              });
          
              const angle = Math.atan2(pieceY - shipBody.position.y, pieceX - shipBody.position.x);
              const velocityX = Math.cos(angle + (Math.random() - 0.5) * pieceSpread) * pieceSpeed;
              const velocityY = Math.sin(angle + (Math.random() - 0.5) * pieceSpread) * pieceSpeed;
              Body.setVelocity(pieceBody, { x: velocityX, y: velocityY });
          
              setTimeout(() => {
                World.remove(engine.world, pieceBody);
                setParticles(prev => prev.filter(p => p.body !== pieceBody));
                // crash takes 5 secs to disappear
              }, 5000);
          
              const newPiece = {
                body: pieceBody,
                rotation: 5, // Adjust rotation if needed
                lifetime: 1000 // Adjust lifetime if needed
              };
          
              World.add(engine.world, pieceBody);
              setParticles(prev => [...prev, newPiece]);
            }
          };
          emitCrash(ship); // ship explodes on crash
          ship.render.visible = false; // ship disappears on crash

//------------------------------------ subtract life on crash ------------------------------------------//
           if (lives === 0) {
            setGameOver(true);
            emitCrash(ship); // trigger when ship collides with asteroid

setTimeout(() => {
setShowFinalScore(true);
}, 5000); // 5secs before final score screen


           } else {
            setLives(prevLives => {
              const updatedLives = prevLives - 1;
                
                          // Remove all asteroids
          asteroids.forEach((asteroid) => {
            World.remove(engine.world, asteroid);
          });
//------------------------// 5 sec Timeout: reset ship, asteroids //---------------------//
setTimeout(() => {
     Body.setPosition(ship, { x: 790, y: 350 }); // reset ship pos to center
     Body.setVelocity(ship, { x: 0, y: 0 }); // Reset ship velocity 
     Body.setAngularVelocity(ship, 0); // Reset ship angular velocity
// Create more asteroids (reset them)
for (let i = 0; i < 5; i++) {
  createAsteroid();
}
  setGameOver(false);
  ship.render.visible = true; // ship reappears new life

}, 4000); // 4secs before reset
//-----------------------------------------------------------------------------------------//
              return updatedLives;
            });
           }
        }
      });
    };

    Events.on(engine, 'collisionStart', handleCollisions);
  
    return () => {
      Events.off(engine, 'collisionStart', handleCollisions);
    };
  }, [engine, ship, asteroids, gameOver]);

//--------------------------------// CLOCKING SCORE //----------------------------------//

useEffect(() => {
  // Continuous score increment example
  const scoreInterval = setInterval(() => {
    if (!gameOver) {
      setScore(prevScore => prevScore + 1); // Increment score by 1 point every second
    }
  }, 100); 

  return () => clearInterval(scoreInterval); // Cleanup on unmount
}, [gameOver]);

// --------------------------------// GAME SCREENS //----------------------------------//

if (showHighScores) {
  return <HighScores />;
}

if (showFinalScore) {
  return <FinalScore score={score} onHighScores={showHighScorePage} />;
}

//----------------------------------// RENDERING //----------------------------------//

return (
  <div>
    {!startGame && <StartScreen onStart={startGameHandler} onHighScores={showHighScorePage} />}
    {startGame && (
      <div className="game-container" ref={gameRef}>
        {/* Your existing game rendering code */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over">
              Game Over
            </div>
          </div>
        )}
        <div className="score-display">
          Score: {score}
        </div>
        <div className="lives-display">
          Lives: <span className='life-triangle'>{'∆ '.repeat(lives)}</span>
        </div>
      </div>
    )}
  </div>
);
};

export default Asteroids;
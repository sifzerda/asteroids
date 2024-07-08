
import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';
import decomp from 'poly-decomp';

const AsteroidsGame = () => {
  const [engine] = useState(Engine.create());
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });

  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const [asteroidSizes, setAsteroidSizes] = useState([]);
  const [asteroidHits, setAsteroidHits] = useState([]);
  const [lives, setLives] = useState(3); // Initialize lives at 3roids count

  const gameRef = useRef();

  window.decomp = decomp; // poly-decomp is available globally

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

// Function to replace all exploded asteroids --------------------------------------------------------//
    const replaceAsteroids = () => {
      const asteroidRadii = [80, 100, 120, 140, 160]; // Predefined radii for asteroids
      const numberOfAsteroids = 1; // Number of asteroids to replace
  
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
  
        // Randomize starting position anywhere outside the visible screen
        const startX = Math.random() * 3000 - 750; // Randomize x position across a wider area
        const startY = Math.random() * 1700 - 340; // Randomize y position across a wider area
  
        // Randomize velocity direction and speed
        const velocityX = (Math.random() - 0.5) * 4; // Random velocity in x direction
        const velocityY = (Math.random() - 0.5) * 4; // Random velocity in y direction
  
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
        newAsteroids.push(asteroid);
        World.add(engine.world, asteroid);
      }
  
      setAsteroids(newAsteroids);
      setAsteroidSizes(newAsteroidSizes);
      setAsteroidHits(newAsteroidHits);
    };

//------------------------// SET UP MATTER.JS GAME OBJECTS //-------------------------//
  useEffect(() => {
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
      render: {
        fillStyle: 'transparent',
        strokeStyle: '#ffffff', 
        lineWidth: 2,
        visible: true
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
    
//---------------------------------// ASTEROIDS //-----------------------------------//
    const createAsteroids = () => {
      
      const asteroidRadii = [80, 100, 120, 140, 160]; // Predefined radii for asteroids
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
    
        // Randomize starting position anywhere outside the visible screen
        const startX = Math.random() * 3000 - 750; // Randomize x position across a wider area
        const startY = Math.random() * 1700 - 340; // Randomize y position across a wider area
    
        // Randomize velocity direction and speed
        const velocityX = (Math.random() - 0.5) * 4; // Random velocity in x direction
        const velocityY = (Math.random() - 0.5) * 4; // Random velocity in y direction
    
        const asteroid = Bodies.fromVertices(startX, startY, vertices, {
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

        Body.setVelocity(asteroid, { x: velocityX, y: velocityY });
        Body.setAngularVelocity(asteroid, 0.01); // Adjust angular velocity as needed
        newAsteroids.push(asteroid);
        World.add(engine.world, asteroid);
      }

      setAsteroids(newAsteroids);
      setAsteroidSizes(newAsteroidSizes);
      setAsteroidHits(newAsteroidHits);
    };
    createAsteroids();

        // Interval to replace asteroids every 10 seconds --- causes lag
        //const intervalId = setInterval(createAsteroids, 60000);

    const updateShipPosition = () => {
      setShipPosition({
        x: shipBody.position.x,
        y: shipBody.position.y,
        rotation: shipBody.angle * (180 / Math.PI)
      });
    };

    Events.on(engine, 'beforeUpdate', updateShipPosition);

    return () => {
      //clearInterval(intervalId); -- causes lag
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      Events.off(engine, 'beforeUpdate', updateShipPosition);
    };
  }, [engine]);

  
  const moveShipUp = () => {
    if (ship) {
      const forceMagnitude = 0.0003;
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
ship.render.visible = false; // Set ship visibility to false on crash
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
                // crash takes 8 secs to disappear
              }, 6000);
          
              World.add(engine.world, pieceBody);
            }
          };
          emitCrash(ship); // Trigger ship explosion animation

//------------------------------------ subtract life on crash ------------------------------------------//
           if (lives === 0) {
            setGameOver(true);
            emitCrash(ship); // trigger when ship collides with asteroid

           } else {
            setLives(prevLives => {
              const updatedLives = prevLives - 1;
              
                          // Remove all asteroids
          asteroids.forEach((asteroid) => {
            World.remove(engine.world, asteroid);
          });
//------------------------// Timeout before reset new life state //---------------------//
setTimeout(() => {
  replaceAsteroids(); // Replace asteroids logic
  Body.setPosition(ship, { x: 750, y: 340 }); // Reset ship position
  Body.setVelocity(ship, { x: 0, y: 0 }); // Reset ship velocity
  ship.render.visible = true; // Set ship visibility to true after reset
  setGameOver(false); // Reset game over state
}, 4000); // Timeout duration
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

//----------------------------------// RENDERING //----------------------------------//

return (
  <div className="game-container" ref={gameRef}>
    {gameOver && (
      <div className="game-over-overlay">
        <div className="game-over">
          Game Over
        </div>
      </div>
    )}
    <div className="lives-display">
    Lives: <span className='life-triangle'>{'∆ '.repeat(lives)}</span>
    </div>
  </div>
  );
};

export default AsteroidsGame;
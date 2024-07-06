import { useState, useEffect, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Matter, { Engine, Render, World, Bodies, Body, Events } from 'matter-js';
import MatterWrap from 'matter-wrap';

const Stripped = () => {
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
  const [shipPosition, setShipPosition] = useState({ x: 300, y: 300, rotation: 0 });
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [ship, setShip] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.15);
  const gameRef = useRef();

  const MAX_PARTICLES = 10;

  useEffect(() => {
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
      { x: 0, y: 0 },
      { x: 34, y: 14 },
      { x: 0, y: 27 }
    ];

    const shipBody = Bodies.fromVertices(750, 340, vertices, {
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
    Body.rotate(shipBody, -Math.PI / 2);

    setShip(shipBody);
    World.add(engine.world, shipBody);

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

    const createAsteroids = () => {
      const numberOfAsteroids = 5;
      const newAsteroids = [];

      for (let i = 0; i < numberOfAsteroids; i++) {
        const radius = Math.random() * 30 + 80;
        const numVertices = Math.floor(Math.random() * 5) + 5;
        const vertices = randomVertices(numVertices, radius);
        const startX = Math.random() * 1500;
        const startY = Math.random() * 680;
        const velocityX = (Math.random() - 0.5) * 4;
        const velocityY = (Math.random() - 0.5) * 4;

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
        newAsteroids.push(asteroid);
        World.add(engine.world, asteroid);
      }
      setAsteroids(newAsteroids);
    };
    createAsteroids();

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

  const makeExhaust = () => {
    if (ship) {
      const exhaustCount = 5;
      const speed = -2;
      const offset = -30;
      const spreadAngle = 0.2;

      const newParticles = [];

      for (let i = 0; i < exhaustCount; i++) {
        const spreadOffset = (i - (exhaustCount - 1) / 2) * spreadAngle;
        const particleX = ship.position.x + Math.cos(ship.angle) * offset;
        const particleY = ship.position.y + Math.sin(ship.angle) * offset;
        const particleBody = Bodies.circle(particleX, particleY, 1, {
          frictionAir: 0.02,
          restitution: 0.4,
          render: {
            fillStyle: '#ff3300'
          },
          plugin: {
            wrap: {
              min: { x: 0, y: 0 },
              max: { x: 1500, y: 680 }
            }
          }
        });

        const velocityX = Math.cos(ship.angle + spreadOffset) * speed + (Math.random() - 0.5) * 0.5;
        const velocityY = Math.sin(ship.angle + spreadOffset) * speed + (Math.random() - 0.5) * 0.5;
        Body.setVelocity(particleBody, { x: velocityX, y: velocityY });

        const newParticle = {
          body: particleBody,
          rotation: ship.angle,
          lifetime: 100
        };
        World.add(engine.world, particleBody);

        newParticles.push(newParticle);

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

  const shootProjectile = () => {
    if (ship) {
      const speed = 10;
      const offset = 40;
      const projectileX = ship.position.x + Math.cos(ship.angle) * offset;
      const projectileY = ship.position.y + Math.sin(ship.angle) * offset;
      const projectileBody = Bodies.rectangle(projectileX, projectileY, 15, 3, {
        frictionAir: 0.01,
        angle: ship.angle,
        render: {
          fillStyle: '#00FFDC'
        },
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
        lifetime: 100
      };
      World.add(engine.world, projectileBody);
      setProjectiles(prev => [...prev, newProjectile]);

      setTimeout(() => {
        World.remove(engine.world, projectileBody);
        setProjectiles(prev => prev.filter(proj => proj.body !== projectileBody));
      }, 2000);
    }
  };

  useHotkeys('up', moveShipUp, [ship]);
  useHotkeys('up', makeExhaust, [ship]);
  useHotkeys('left', rotateShipLeft, [ship, rotationSpeed]);
  useHotkeys('right', rotateShipRight, [ship, rotationSpeed]);
  useHotkeys('space', shootProjectile, [ship]);

  // Hitting asteroid with gunfire:
  useEffect(() => {
    const handleCollisions = (event) => {
      const pairs = event.pairs;

      pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const isProjectileA = projectiles.find(proj => proj.body === bodyA);
        const isProjectileB = projectiles.find(proj => proj.body === bodyB);
        const isAsteroidA = asteroids.find(ast => ast === bodyA);
        const isAsteroidB = asteroids.find(ast => ast === bodyB);

        if ((isProjectileA && isAsteroidB) || (isProjectileB && isAsteroidA)) {
          World.remove(engine.world, bodyA);
          World.remove(engine.world, bodyB);

          setProjectiles(prev => prev.filter(proj => proj.body !== bodyA && proj.body !== bodyB));
          setAsteroids(prev => prev.filter(ast => ast !== bodyA && ast !== bodyB));
        }
      });
    };

    Events.on(engine, 'collisionStart', handleCollisions);

    return () => {
      Events.off(engine, 'collisionStart', handleCollisions);
    };
  }, [engine, projectiles, asteroids]);

  return (
    <div ref={gameRef} style={{ width: '100%', height: '100%', background: '#111111' }}>
      {gameOver && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#ffffff', fontSize: '48px' }}>
          Game Over
        </div>
      )}
    </div>
  );
};

export default Stripped;
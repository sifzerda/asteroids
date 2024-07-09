# ASTEROIDS 🚀

Current games in gamestack:

- [ ] Minesweeper
- [ ] Solitaire
- [x] Asteroids

## Table of Contents

1. Description
2. Badges
3. Visuals
4. Installation
5. Usage
6. Dev Stuff: Building
7. Bugs and Further Development
8. To do
9. Support
10. Contributing 
11. Authors and acknowledgment
12. License
13. Project status

## (1) Description

A personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. 

This was built with React, Matter.js, ~~react-spring~~ Node, Javascript, and CSS. 

Game was divided up into the smallest working components/units. It began as a game screen with a moving ship, then a couple of asteroids which moved randomly. Collision detection, physics and projectile shooting were put in later. Made three different versions to test alternate physics.

## (2) Badges

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Matter.js](https://img.shields.io/badge/Matter.js-4B5562.svg?style=for-the-badge&logo=matterdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-538DD7.svg?style=for-the-badge&logo=Font-Awesome&logoColor=white) 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## (3) Visuals

[Visit App deployed to Heroku](https://asteroids-10-d02b9b752090.herokuapp.com/)

![asteroids-screenshot-1](https://github.com/sifzerda/solitaire/assets/139626561/a82c2908-baa8-4085-89b9-f19f782646c9)

![asteroids-screenshot-2](https://github.com/sifzerda/solitaire/assets/139626561/597cc570-c867-4a2b-9975-7aa68b7aa358)

## (4) Installation

```bash
git clone https://github.com/sifzerda/asteroids.git
cd asteroids
npm install
npm run start
```

Controls:
- Arrow keys ⬅️ ⬆️ ➡️ ⬇️ keys to move
- Spacebar to fire
- Do a tight turn or doughnut: press UP + L/R Arrow Key together (not sequentially)

## (5) Usage

Technologies:

- <strong>useRef and requestAnimationFrame: </strong> API library to update game state at fps matching the display refresh rate, creating animation, by default 60fps.
- <strong>react-HotKeys: </strong> hook for creating keyboard shortcuts, for game movement.
+ ~~- <strong>react-spring: </strong> animation smoothing, add tension, friction through 'animated divs' (customized through shipStyle, projectileStyle, and asteroidStyle).~~ Removed; conflict with Matter.js.
- <strong>matter-js: </strong> physics and collision detection engine.
- <strong>matter-wrap: </strong> game boundary wrapping.

## (6) Dev Stuff: Building:

The main functions of code:

(A) Movement: 

- <u>const handleKeyDown </u>: Key press event listening for controls and gunfire.
- <u>const updateShipPosition: </u> Sets ship speed and rotational radius.
- <u>setShipPosition…wrapPosition: </u> Ship’s movement wraps to other side of game boundary when passing outside, with small ‘buffer’ zone so ship fully disappears and re-appears.
- <u>const wrapPosition, and Matter Wrap</u>: Wraps game boundary around so there is no game edge; objects pass around to opposite side.
- 
(B) Ship:

- <u>useHotkeys</u>:  Hook which simplifies movement control code.
- <u>const [rotationSpeed, setRotationSpeed] = useState(0.15)];</u>:  sets ship rotation speed.
- <u>Body.rotate(shipBody, -Math.PI / 2)</u>:  Initializes ship's starting position (rotated so facing up). Ship's front is actually right side angle, has to be rotated on game start to face moveUp direction upwards.
- <u>const shipBody = Bodies.fromVertices, const vertices</u>: Shapes ship body.
- <u>emitExplosionParticles</u>: creates red particles when ship crashes.

(C) Projectile fire:

- <u>shootProjectile</u>: Sets gunfire speed, fire position, and fire decay (setTimeout).
- <u>setProjectiles</u>: Limits asteroid and projectile fire to wrap the game boundary.

(D) Thrust fire:

- <u>const makeExhaust</u>: replicates projectile fire but displaced to ship back by 'offset' and renders on arrow key up.

(E) Asteroids:

- <u>useEffect…createAsteroids</u>: Creates some starting asteroids [size, number, rotation, velocity] and calls in new asteroid/s over time. Gets called again on ship crash.
- <u>useEffect...const handleCollisions</u>:  There are 2 useEffect handleCollisions functions; one for shooting asteroids, and one for the ship getting hit. When asteroids are hit, they split into new asteroids with differing initial velocities, and size property. When the ship is hit, it triggers game over.
- <u>emitParticles();</u>: when asteroids are shot, they break off into 'chunks' (particles)

 (F) Game:

- <u>const gameLoop</u>:  Game runs (updates) until game ends. API ‘requestAnimationFrame’ smoothes updates (of gameLoop) into continual flow/animation. Hook requestRef gives each animation ‘frame’ an id, allowing gameLoop to cease on any frame.
- <u>useEffect...const scoreInterval...</u>: Handles score incrementation.
- <u>useEffect(() => {Matter.use...})</u>: Sets up Matter.js game engine, world, objects.
- <u>useEffect(() => {const scoreInterval = setInterval(() => {})})</u>: keeps score.

## (7) Alternative Config

You can replace :
```bash
const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 0 } }));
```
with : 
```bash
const [engine] = useState(() => {
    const newEngine = Engine.create({ gravity: { x: 0, y: 0 } });
    newEngine.velocityIterations = 10; // Increase velocity iterations
    newEngine.positionIterations = 10; // Increase position iterations
    return newEngine;
  });
```
to create smoother ship acceleration, however this may affect performance and not offer much improvement.

I experimented with handling movement keyUp and keyDown separately via useEffect to apply different physics to ship motion vs rest, but this didn't have much overall effect. I saved the relevant code inside: client/src/components/copies/movementdiff.js

change 'shootExhaust' fillStyle for randomized exhaust stream colours (i.e. rainbow exhaust stream):
```bash
fillStyle: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.8)` 
```
Note: too much use of Math.floor(Math.random()) in big quantities (e.g. many particles) affected performance, so I tried to limit randomization.

Ship size; x/ vertices by amount (e.g. 50 / .3) for each value:
(1) Current size:
```bash
      { x: 0, y: 0 }, 
      { x: 34, y: 14 }, 
      { x: 0, y: 27 }     
```
(2) Tiny ship:
```bash
      { x: 0, y: 0 },  
      { x: 16, y: 6 },   
      { x: 0, y: 13 }  
```
(2) Bigger ship:
```bash
      { x: 0, y: 0 }, 
      { x: 50, y: 20 },   
      { x: 0, y: 40 }   
```
(2) Even Bigger ship:
```bash
      { x: 0, y: 0 }, 
      { x: 65, y: 26 },   
      { x: 0, y: 52 }   
```
Acceleration: raise (closer to 1.0) for speed
```bash
  const moveShipUp = () => {
[...]
      const forceMagnitude = 0.0003; 
    }
```

## (8) Bugs and Further Development: 

- occasionally asteroids are spawned which seem to lack collision detection so you can't hit or crash into them.
- spam shooting gunfire everywhere trips up the collision detection and won't hit asteroids.

Optimization:
- use react-virtualized to only render visible stuff
- once game basically running, convert it into Redux or Zustand
- use a bundler like Webpack or Parcel to optimize build output: Enable code splitting, tree-shaking, and minification to reduce bundle size and improve load times.
- Consider memoizing components like Projectile and Particle using React.memo to prevent unnecessary re-renders, especially if their props rarely change.

## (9) To do: 

- alt screens: start game, game over, score submission etc
- make layout distinct from minesweeper and solitaire
- 
- [x] Create basic black game screen
- [x] Create moving ship 
- [x] Create some randomly moving asteroids
- [x] Make more asteroids and different size asteroids
- [x] Enable projectile firing
- [x] make rocket exhaust
- [x] ~~timer, score count every asteroid hit~~
  - [x] Or one single score count which is continuously running up (like a timer) and gets extra increments every asteroid destroyed
- [x] Gunfire decay and boundary wrapping
- [x] Projectile collision detection with asteroids
- [x] Ship detection with asteroids
- [x] When you shoot an asteroid it disappears
  - [x] When you shoot asteroids they break into two smaller, and so on
- [ ] improve graphics elements
- [x] refine ship movement; add limited inertia
- [ ] bullet flashing/muzzle flare effect
- [ ] asteroids flash or change color when hit
- [ ] Power ups randomly appear around screen for several seconds which change projectile type/power/appearance:
  - [ ] Boost (or add boost ability in general)
- [x] ~~Level progression:~~
  - [ ] ~~Higher level (i.e. more time) asteroids take longer to break up, or break up into smaller divisions~~
- [x] ~~Dividing play session into levels. After a certain time, 'level 2' flashes on screen and difficulty ramps each level increase.~~

Navigation:

- [x] Game Start screen
- [x] Game win/loss screen
  - ~~[ ] Timer~~
  - [x] Score
  - ~~[ ] Total level~~
- [ ] Exit game through main game
- [x] Highscores (from start screen)
- [x] Submit highscores
- [x] Profile scores and logging in

## (10) Support

For support, users can contact tydamon@hotmail.com.

## (11) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (12) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project including:

- ChatGPT

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is completed. 

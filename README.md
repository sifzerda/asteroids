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
9. To do for all games
10. Support
11. Contributing 
12. Authors and acknowledgment
13. License
14. Project status

## (1) Description

A personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. 

This was built with React, Matter.js, Node, Javascript, and CSS. 

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
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![FontAwesome](https://img.shields.io/badge/Font%20Awesome-538DD7.svg?style=for-the-badge&logo=Font-Awesome&logoColor=white) 
![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)

## (3) Visuals

[Visit App deployed to Heroku](https://asteroids-10-[...].herokuapp.com/)

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
- ?
- ?
- ?

## (5) Usage

 The app executes a version of the retro arcade game 'asteroids'. Parts:
 
 - Start screen
 - Game
 - Final score page + score submission
 - High scores page
 - If logged on: profile page with User scores.

Technologies:

- <strong>useRef and requestAnimationFrame: </strong> API library to update game state at fps matching the display refresh rate, creating animation, by default 60fps.
- <strong>react-HotKeys: </strong> hook for creating keyboard shortcuts, for game movement.
- <strong>react-spring: </strong> animation smoothing, add tension, friction through 'animated divs' (customized through shipStyle, projectileStyle, and asteroidStyle)
- <strong>matter-js: </strong> physics and collision detection.
- <strong>matter-wrap: </strong> game boundary wrapping.

## (6) Dev Stuff: Building:

The main functions of code:

1. <u>const handleKeyDown:</u> key press event listening to control ship movement and gunfire.
2. <u>const updateShipPosition:</u> sets ship speed and rotational radius.
3. <u>setShipPosition…wrapPosition:</u> ship’s movement wraps to other side of game boundary when passing outside. A ‘buffer’ zone allows ship to pass and re-enter just outside boundary.
4. <u>shootProjectile:</u> sets gunfire speed, fire position, and fire decay (setTimeout).
5. <u>useEffect…initialAsteroids:</u> creates some starting asteroids in random starting position and inertia (velocity).
6. <u>useEffect…initialAsteroids:</u> creates some starting asteroids in random starting position and inertia (velocity).
7. <u>const gameLoop:</u>  Keep game running (updating) until game ends. ‘requestAnimationFrame’ is an API which smoothes game updating (of gameLoop) into seamless continual flow. requestRef is a hook which gives each animation ‘frame’ an id, allowing gameLoop to cease on any frame.
8. <u>const updateGame and setProjectiles:</u> limits asteroid and projectile fire to wrap the game boundary.
9. <u>const wrapPosition, and Matter Wrap:</u> wraps game boundary around so there is no game edge; objects pass around to opposite side.
10. <u>const checkCollisions and projectiles.forEach:</u> delimits collision radius of ship and asteroids, and projectiles and asteroids.
11. <u>handleProjectileCollision:</u> when asteroids are hit, they split into new asteroids with differing initial velocities, and size property.
12. <u>const Projectile:</u> makes projectile lifespan a (decaying) timer from firing.
13. <u>const moveAsteroid:</u> handles  asteroid motion and speed.
14. <u>useHotKeys: </u> hook which simplifies movement control code.
15. <u>shipStyle, asteroidStyle, projectileStyle: </u> react-spring adds some physics config options to game objects.
16. <u></u>
17. <u></u>
18. <u></u>
19. <u></u>
20. <u></u>
21. <u></u>
22. <u>const [rotationSpeed, setRotationSpeed] = useState(0.08): </u> sets ship rotation speed.
23. <u>const shipBody = Bodies.fromVertices, const vertices: </u> Shapes ship body. 
24. <u>Body.rotate(shipBody, -Math.PI / 2): </u> Initializes ship's starting position (rotated so facing up). Ship's front is actually right side angle, has to be rotated on game start to face moveUp direction upwards.
25. <u>UseHotkeys: </u> control binding, simplifies movement code.
26. <u>gameLoop, requestAnimationFrame </u> repeats game updates, and syncs with display refresh rate to create animation.
27. <u></u>
28. <u></u>

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
to create smoother ship acceleration, however this may affect performance.

I experimented with handling movement keyUp and keyDown separately via useEffect to apply different physics to ship motion vs rest, but this didn't have much effect.



## (8) Bugs and Further Development: 

- 
- 
- 

## (9) To do: 

optimization:
- once you've got multiple asteroids use react-virtualized to only render visible stuff
- once game basically running, convert it into Redux or Zustand
- use a bundler like Webpack or Parcel to optimize build output: Enable code splitting, tree-shaking, and minification to reduce bundle size and improve load times.


- [x] Create basic black game screen
- [x] Create moving ship 
- [x] Create some randomly moving asteroids
- [ ] Make more asteroids and different size asteroids
- [x] Enable projectile firing
- [ ] timer, score count every asteroid hit
  - [ ] Or one single score count which is continuously running up (like a timer) and gets extra increments every asteroid destroyed
- [x] Gunfire decay and boundary wrapping
- [x] Projectile collision detection with asteroids
- [x] Ship detection with asteroids
- [x] When you shoot an asteroid it disappears
  - [x] When you shoot asteroids they break into two smaller, and so on
- [ ] improve graphics elements
- [ ] refine ship movement; add limited inertia, add acceleration (longer you hold down up, faster you speed up), 
- [ ] bullet flashing/muzzle flare effect
- [ ] asteroids flash or change color when hit
- [ ] Power ups randomly appear around screen for several seconds which change projectile type/power/appearance:
  - [ ] Speed up (or slow down)
  - [ ] Boost (or add boost ability in general)
  - [ ] 
- [ ] 
- [ ] Level progression:
  - [ ] Higher level (i.e. more time) asteroids take longer to break up, or break up into smaller divisions
- [ ] 
- [ ] Dividing play session into levels. After a certain time, 'level 2' flashes on screen and difficulty ramps each level increase. Also next to timer, put level.
- [ ]
- [ ] Points every asteroid hit
- [ ] Timer (counts from 0)
- [ ] Time is added to final score or possibly multipled up (every second = 10 or 100 points)
- [ ] 
- [ ]
- [ ]
- [ ]
- [ ] 
- [ ] 



Borrow from minesweeper:

- [ ] Game Start screen
- [ ] Game win/loss screen
  - [ ] Timer
  - [ ] Score
  - [ ] Total level
  - [ ] 
- [ ] Exit game through main game
- [ ] Highscores (from start screen)
- [ ] Submit highscores
- [ ] Profile scores and logging in





 

## (10) To do for all games
- [x] create start game landing screen: + start game btn; + high scores btn
- [x] end game/win game screen, + view score, + submit score, + see high scores, + restart game
- [x] if user logged in, can save high score (post to user array)
- [x] profile page where scores can be displayed
- [ ] have 8-bit chiptune stylized music play during game (with button that starts and stops music, maybe a speaker pic that gets struck through)
- [ ] volume increase/decrease for music
- [ ] play through albums as 8-bit, and can play next song in list

## (11) Support

For support, users can contact tydamon@hotmail.com.

## (12) Contributing

Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". 
1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/NewFeature)
3. Commit your Changes (git commit -m 'Add some NewFeature')
4. Push to the Branch (git push origin feature/NewFeature)
5. Open a Pull Request

## (13) Authors and acknowledgment

The author acknowledges and credits those who have contributed to this project, including:

- ChatGPT

## (14) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (15) Project status

This project is completed. 

Otherwise it has a couple of minor, non-game-breaking bug issues:
- Cards can be inserted into tableau piles behind other cards. You have to make sure you drop the card onto the correct (topmost) card.
- Sometimes cards dropped onto tableau piles turn facedown. You have to click them to turn them back faceup.
- Further development to fix these issues needed.
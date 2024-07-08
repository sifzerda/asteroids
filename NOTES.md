Advanced Ship Behavior:

Implementing advanced maneuvers or abilities (e.g., temporary invulnerability after respawn).
Power-ups affecting ship performance (e.g., speed boost, temporary shields).

Physics Libraries:

Box2DWeb: A port of the popular C++ physics engine Box2D, optimized for web environments. It's known for its stability and accuracy in physics simulations.
Planck.js: A lightweight 2D physics engine that offers similar functionality to Box2D but with a focus on modular design and ease of use.
p2.js: A 2D physics library that supports both WebGL and Node.js. It's known for its performance optimizations and support for complex physics interactions.

ASTEROIDS:

- flickering rocket fire effect whenever 'up' pressed
- boost (press x)
- flashing:
	- when gunfire
	- when hit asteroid
	- when die

SOUND EFFECTS:

- soft rocket fire rumbling whenever you press move forward for thruster
- bullet fire whenever you shoot a projectile (different sounds for different style guns)
- bullet impact with asteroid

modify so asteroids are continously being added to game at steady rate (e.g. every level increase replenishes removed asteroids)

Songs for asteroids:

- Pixel Thieves: main screen
- Atomic Halo
- Pig cart racer
- Apex (jaga jazzist)
- Oban (jaga jazzist) (first level phase)

Pixel thieves: start screen, highscores, score submission, general site

1. Pig cart racer (possibly edit to make shorter)
2. Oban (eidt to make shorteR)
3. Apex
4. Atomic Halo (edit to make build into second chorus)

probably need matter.js and - potentially - react spring for below:

- pacman
- tetris
- space invaders
- slot machine (probably need matter.js - and potentially react-spring to give spinning physics and animation smoothing)
- dirt bike (make basic without graphics (just polygons to jump over) then put graphic in functionally completed game)
- some kind of 2D platformer (make this after dirt bike as test)
- 8 ball pool (matter JS)
- experiment with 3D (three-fiber) maybe basic platformer levels
- optional: try to make a 2D-appears-3D style kart racing game, like mario kart on SNES. Basic without graphics (just shapes, lines, and physics)
- a 'dino run' style game of outrunning something, jumping over obstacles. This would be like an inverted version of dirt bike, where you have to get over obstacles to get away from something (in dirt bike, the goal is get to end, this; goal is get away from start)

react-spring: For more complex animations and transitions.

Physics and Collision Detection:

matter-js: A popular 2D physics engine which can handle physics and collision detection.
react-matter-js: A React wrapper for Matter.js.

react-konva: For 2D canvas rendering, which can be simpler than using three.js for a 2D game like Asteroids.
pixi.js and react-pixi: Another option for rendering 2D graphics with WebGL.

react-three-fiber: A powerful renderer for three.js in React, useful if you want to include 3D elements.

User Input Handling:

react-hotkeys: For handling keyboard input.
react-use-gesture: For handling mouse and touch gestures.

Sound Effects:

howler: A popular library for playing audio.
react-howler: A React wrapper for Howler.



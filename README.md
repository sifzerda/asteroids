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
7. Bugs 
8. To do
9. To do for all games
10. Support
11. Contributing 
12. Authors and acknowledgment
13. License
14. Project status

## (1) Description

A personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. 

This was built with React, Node, Javascript, and CSS. 

The game had to be divided up into the smallest working components/units. It began as a game screen with a moving ship, then a couple of asteroids which moved randomly. Collision detection and projectile shooting were put in later.

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

## (5) Usage

 The app executes a version of the retro arcade game 'asteroids'. Parts:
 
 - Start screen
 - Game
 - Final score page + score submission
 - High scores page
 - If logged on: profile page with User scores.

## (6) Dev Stuff: Building:

The main functions of code:

1. <u>Initialization, Positioning:</u> mmmmmm.
2. <u>Movement:</u> A useEffect hook and EventListeners on keydown enable ship movement with arrow keys. useEffect calls moveShip and rotateShip on key-press.
3. 
4. 
5. 
6. 
7. <u>'const initialTableau':</u> Creates Tableau into 7 cols, each col contains the number of cards as it's id (e.g. col 7 contains 7 cards). Initializes empty. Originally tableau sliced off cards from the stockpile, but the 'card sharing' caused issues and had to be reworked.
8. <u>'const Solitaire':</u> Runs main game code (i.e. covers user activity).
9. <u>'const updatedCards', 'const updatedDecks'</u> The state of each foundation suit deck is trackable separately and updated per card dropped.
10. <u>'const [currentCardIndex, setCurrentCardIndex] = useState(0)', 'const nextCard' + onClick={nextCard}:</u> Actions the Stockpile click cycle. 
11. <u>'const shuffleArray':</u> shuffles cards in stockpile and tableau after distribution.
12. <u>'const onDragEnd':</u> Collects and Executes all DnD functions for stockpile, tableau and foundations:
   - <u>'const handleStockpileToTableauDrop':</u> DnD from Stockpile to Tableau;
   - <u>'const handleTableauToTableauDrop':</u> DnD from Tableau to Tableau;
   - <u>'handleFoundationDrop':</u> DnD from any to Foundations.
13. <u>'return':</u> renders stockpile ('cards'), tableau, and foundations and contains in DnD areas.
Other:
1.  <u>'else if (source.droppableId.startsWith('tableau')...)':</u> Enables tableau cards to be dragged in stacks (piles), from source.index -> last-item. 
2.  <u>'return {... t-drag-card-group}':</u> this targets a tableau -> tableau pile of cards and applies a class selector which allowed me to modify appearance of dragging card pile as a single object/stack. React Beautiful DnD didn't seem to have a 'group/multiple object/s' dragging graphic, so I had to make it manually with CSS.
3.  <u>return {...}</u> conditionally renders tableau card as faceup or facedown depending on card's array index.
4.  <u>'index === pile.cards.length - 1 ? ...'</u> Conditional rendering of card DnD based on whether card is faceup or facedown. Facedown cards are not draggable. Tableau.pile array -1 is facedown (i.e. everything but top card).
5.  <u>'const initialTableau': </u>'faceUp' property tracks faceup cards. 

## (7) Bugs: 

- 
- 
- 

## (8) To do: 

- [x] Create basic black game screen
- [x] Create moving ship 
- [x] Create some randomly moving asteroids
- [ ] Make more asteroids and different size asteroids
- [ ] Enable projectile firing
- [ ] Projectile collision detection with asteroids
- [ ] Ship detection with asteroids
- [ ] When you shoot an asteroid it disappears
  - [ ] When you shoot asteroids they break into two smaller, and so on
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





 

## (9) To do for all games
- [x] create start game landing screen: + start game btn; + high scores btn
- [x] end game/win game screen, + view score, + submit score, + see high scores, + restart game
- [x] if user logged in, can save high score (post to user array)
- [x] profile page where scores can be displayed
- [ ] have 8-bit chiptune stylized music play during game (with button that starts and stops music, maybe a speaker pic that gets struck through)
- [ ] volume increase/decrease for music
- [ ] play through albums as 8-bit, and can play next song in list

## .(10) Support

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

The author acknowledges and credits those who have contributed to this project, including:

- ChatGPT

## (13) License

Distributed under the MIT License. See LICENSE.txt for more information.

## (14) Project status

This project is completed. 

Otherwise it has a couple of minor, non-game-breaking bug issues:
- Cards can be inserted into tableau piles behind other cards. You have to make sure you drop the card onto the correct (topmost) card.
- Sometimes cards dropped onto tableau piles turn facedown. You have to click them to turn them back faceup.
- Further development to fix these issues needed.
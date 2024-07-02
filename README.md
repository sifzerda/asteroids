# ASTEROIDS 🂡

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

A personal project to create a react MERN stack app which has a number of simple games. I used trial and error and ChatGPT prompting. This was more challenging to make than minesweeper and took some experimentation, and a lot of debugging.

As with minesweeper the game had to be divided up into the smallest working components/units. It began as a simple DnD interface where one of 52 boxes (cards) could be dragged and dropped onto 4 rectangles (foundations). Then the DnD dynamic was configured to operate according to Solitaire rules, preventing DnD unless there was a match of card suit and rank.

Lessons learned from building this project:

- How to implement a Drag and Drop package (react beautiful dnd);
  - The dnd packages don't allow dragging of group items. I had to combine grouped cards into one object and style it like multiple cards. Apparently you can drag multiple objects using 'react-beautiful-dnd multi drag pattern'.
- Make the game full generally, rather than specific and partially;
- Create basic working dnd structures and build the game around them, rather than try to make a conditional click-based display/game, and implement the dnd dynamic later. The more moving parts, the harder it is to get dnd in;
- Create all game display parts (stockpile, foundations, tableau) first, and then give them operational logic, rather than create one fully working part one at a time;
- Make all possible moves legal and then impose conditions later, rather than build on priori rules.
- Try to keep all code together for context, but where necessary, make backup copies with partial code for debugging.
- Save all/extra code in backup files.

<u>Generally: Build God mode basic, expand, then limit. </u>

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

[Visit App deployed to Heroku](https://solitaire-10-c835a42e5e11.herokuapp.com/)

![solitaire-screenshot-1](https://github.com/sifzerda/solitaire/assets/139626561/a82c2908-baa8-4085-89b9-f19f782646c9)

![solitaire-screenshot-2](https://github.com/sifzerda/solitaire/assets/139626561/597cc570-c867-4a2b-9975-7aa68b7aa358)

## (4) Installation

```bash
git clone https://github.com/sifzerda/solitaire.git
cd solitaire
npm install
npm run start
```

## (5) Usage

 The game executes a game of solitaire with traditional rules. Parts:
 
 - Start screen
 - Game
 - Final score page + score submission
 - High scores page
 - If logged on: profile page with User scores.

## (6) Dev Stuff: Building:

The main/mother function is 'onDragEnd' which indexes and executes all other major DnD functions. 

1. <u>'const initialCards':</u> Creates full playing card deck data.  
2. <u>'const initialDecks':</u> Splits the deck into 4 suits and initializes empty.
3. <u>'const initialTableau':</u> Creates Tableau into 7 cols, each col contains the number of cards as it's id (e.g. col 7 contains 7 cards). Initializes empty. Originally tableau sliced off cards from the stockpile, but the 'card sharing' caused issues and had to be reworked.
4. <u>'const Solitaire':</u> Runs main game code (i.e. covers user activity).
5. <u>'const updatedCards', 'const updatedDecks'</u> The state of each foundation suit deck is trackable separately and updated per card dropped.
6. <u>'const [currentCardIndex, setCurrentCardIndex] = useState(0)', 'const nextCard' + onClick={nextCard}:</u> Actions the Stockpile click cycle. 
7. <u>'const shuffleArray':</u> shuffles cards in stockpile and tableau after distribution.
8. <u>'const onDragEnd':</u> Collects and Executes all DnD functions for stockpile, tableau and foundations:
   - <u>'const handleStockpileToTableauDrop':</u> DnD from Stockpile to Tableau;
   - <u>'const handleTableauToTableauDrop':</u> DnD from Tableau to Tableau;
   - <u>'handleFoundationDrop':</u> DnD from any to Foundations.
9.  <u>'return':</u> renders stockpile ('cards'), tableau, and foundations and contains in DnD areas.
Other:
1.  <u>'else if (source.droppableId.startsWith('tableau')...)':</u> Enables tableau cards to be dragged in stacks (piles), from source.index -> last-item. 
2.  <u>'return {... t-drag-card-group}':</u> this targets a tableau -> tableau pile of cards and applies a class selector which allowed me to modify appearance of dragging card pile as a single object/stack. React Beautiful DnD didn't seem to have a 'group/multiple object/s' dragging graphic, so I had to make it manually with CSS.
3.  <u>return {...}</u> conditionally renders tableau card as faceup or facedown depending on card's array index.
4.  <u>'index === pile.cards.length - 1 ? ...'</u> Conditional rendering of card DnD based on whether card is faceup or facedown. Facedown cards are not draggable. Tableau.pile array -1 is facedown (i.e. everything but top card).
5.  <u>'const initialTableau': </u>'faceUp' property tracks faceup cards. 

## (7) Bugs: 

- Cards must be put onto tableau in specific position (i.e. on top) otherwise insert at some other point in the tableau pile
- Very rarely a card will vanish entirely after dropping and game must be restarted
- Cards can be pulled from anywhere in the tableau pile.
- Sometimes a card dropped onto a tableau pile will switch to facedown state. Clicking it will cause it to return to faceup state.

## (8) To do: 

- [x] Create Foundation area/boxes for cards to slot/stack into
- [x] Create Stockpile of free cards
- [x] Drag n Drop mechanics between stockpile and foundation
- [x] Foundation logic: accept cards in sequential order (A -> K)
  - [x] Will accept Ace per suit
  - [x] Will accept Ace - > 2 per suit
  - [x] Will accept Ace - > 3 per suit
  - [x] Will accept Ace -> K (all) per suit 
- [x] Create Tableau of 7 cols with incrementally more card rows
- [x] Drag n Drop mechanics between tableau and foundation
- [x] Drag n Drop mechanics between stockpile and tableau
  - [x] refine dropping to obey solitaire rules conditions
- [x] Drag n Drop between tableau columns
  - [x] refine dropping to obey solitaire rules conditions
- [x] Drag n Drop of entire tableau groups of cards between cols
- [x] Facedown all tableau cards except top
- [x] Change 'next card' button to a facedown stack of cards
  - [x] I.e. make the stockpile a stack (or show all cards) and style like foundation and tableau stacks (but increase neg margin)
- [x] Style cards in tableau to layer
- [x] Style cards in foundation to layer
- [x] recover tableau group drag animation (group drag works it's just lost the in-between animation)
  - [x] After testing/debugging, change -150 to -170 of CSS: .card-in-deck + .card-in-deck

Stuff to do once main game functioning (i.e. easier implementable latter tasks):

- [ ] double clicking a card in stockpile; if there's a valid move to foundations (but not other areas), will automatically make that move 
- [ ] double clicking a card in tableau; if there's a valid move to foundations (but not other areas), will automatically make that move 
- [x] import card images - prob do this last
- [x] reshuffle stockpile button, basically restarts game
- [x] timer: restarts on game refresh
- [ ] Points system, each time a card is placed on foundation, it adds points (if cards can be removed from foundation, don't forget to subtract points for that)
-  Points system: add time to points so the less time, the more points you get, *** put this in minesweeper
- [x] Handling upon: game win
- [ ] Handling upon: game loss, or no valid moves left that would allow game win
- [x] highscores comp
- [x] submit score/time if logged in
- [x] user profile page shows how many games user has won, and quickest (least time) wins
- [ ] Make each part of the game a separate component
- [ ] OPTIONAL: Some kind of animation upon winning game

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
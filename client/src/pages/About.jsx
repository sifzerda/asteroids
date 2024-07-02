import '../App.css';
import Minesweeper from '../components/Minesweeper';
import '../minesweeper.css';

export default function About () {
  return (
    <div>
       <h1>How to Play</h1> 

      <div className="separator-line"></div>

<p>Click on a square to reveal what is underneath it. The number in the cell indicates how many mines are adjacent to it. Use this information to deduce which cells are safe to click. If you think a cell contains a mine, right-click it to flag it. If you think a flagged cell is safe, right-click it again to unflag it. The game is won when all safe cells are revealed and lost when a mine is revealed.</p>
      
      <div className="separator-line"></div>

{/* game component */}

<div className='grid-wrapper'>
<div className='white-box'>
      <Minesweeper />
</div>
</div>
{/* -------------- */}

    </div>
  );
}

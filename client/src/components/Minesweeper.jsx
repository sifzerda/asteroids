
import { useState, useEffect } from 'react';
import StartGame from '../components/StartGame';
import HighScores from '../components/HighScores';
import FinalScore from '../components/FinalScore';

const Grid = () => {
  const [difficulty, setDifficulty] = useState('easy'); // State for difficulty level
  const difficultyOptions = ['easy', 'normal', 'hard'];

  // Define difficulty settings
  const difficultySettings = {
    easy: { rows: 10, cols: 10, bombs: 15 },
    normal: { rows: 20, cols: 20, bombs: 90 },
    hard: { rows: 30, cols: 30, bombs: 180 }
  };

  const { rows, cols, bombs } = difficultySettings[difficulty];

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /* mine */ [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  // Function to generate initial grid based on difficulty settings
  const generateInitialGrid = () => {
    return Array(rows).fill().map((_, rowIndex) =>
      Array(cols).fill().map((_, colIndex) => ({
        id: rowIndex * cols + colIndex + 1,
        active: true,
        content: '',
        revealed: false,
        flagged: false
      }))
    );
  };

  const [grid, setGrid] = useState(generateInitialGrid());
  const [nonBombCellsCount, setNonBombCellsCount] = useState(rows * cols - bombs);
  const [revealedNonBombCount, setRevealedNonBombCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    checkWinCondition();
  }, [revealedNonBombCount]);

  const startGame = () => {
    setGameStarted(true);
    generateNewGrid();
  };

  const showHighScorePage = () => {
    setShowHighScores(true);
  };

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleClick = (row, col) => {
    const cell = grid[row][col];
    if (!cell.active || cell.revealed) {
      return;
    }
    if (!isActive) {
      startTimer();
    }
    const newGrid = [...grid];
    if (cell.content === 'X') {
      newGrid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell.content === 'X') {
            newGrid[rowIndex][colIndex].content = '💣';
            newGrid[rowIndex][colIndex].active = false;
            newGrid[rowIndex][colIndex].revealed = true;
          }
        });
      });

      setGrid(newGrid);

      setTimeout(() => {
        alert(`You activated a mine. Game Over. Score: ${score}, Time taken: ${timer} seconds`);
        setIsActive(false);
        setShowFinalScore(true);
      }, 500);
    } else {
      const revealSafeCells = (r, c, cellsToReveal) => {
        if (newGrid[r][c].revealed || cellsToReveal === 0) return;

        newGrid[r][c].revealed = true;
        setRevealedNonBombCount(prevCount => prevCount + 1);
        setScore(prevScore => prevScore + 10);
        cellsToReveal--;

        if (newGrid[r][c].content === '') {
          directions.forEach(([dRow, dCol]) => {
            const newRow = r + dRow;
            const newCol = c + dCol;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              revealSafeCells(newRow, newCol, cellsToReveal);
            }
          });
        }
      };

      revealSafeCells(row, col, 3);
      setGrid(newGrid);
    }
  };

  const handleRightClick = (event, row, col) => {
    event.preventDefault();

    if (!grid[row][col].active || grid[row][col].revealed) {
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col].flagged = !newGrid[row][col].flagged;

    setGrid(newGrid);
  };

  const generateNewGrid = () => {
    const newGrid = generateInitialGrid();

    const randomCells = [];
    while (randomCells.length < bombs) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      if (!randomCells.some(cell => cell.row === randomRow && cell.col === randomCol)) {
        randomCells.push({ row: randomRow, col: randomCol });
      }
    }

    randomCells.forEach(cell => {
      newGrid[cell.row][cell.col].content = 'X';
    });

    newGrid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.content !== 'X') {
          let bombCount = 0;
          directions.forEach(([dRow, dCol]) => {
            const newRow = rowIndex + dRow;
            const newCol = colIndex + dCol;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              if (newGrid[newRow][newCol].content === 'X') {
                bombCount++;
              }
            }
          });
          cell.content = bombCount > 0 ? bombCount.toString() : '';
        }
      });
    });

    setGrid(newGrid);
    setRevealedNonBombCount(0);
    setScore(0);
    setTimer(0);
    setIsActive(false);
  };

  const checkWinCondition = () => {
    if (revealedNonBombCount === nonBombCellsCount) {
      setIsActive(false);
      alert(`You won! Score: ${score}, Time taken: ${timer} seconds`);
      setShowFinalScore(true);
    }
  };

  if (showHighScores) {
    return <HighScores />;
  }

  if (showFinalScore) {
    return <FinalScore score={score} time={timer} onHighScores={showHighScorePage} />;
  }

  return (
    <div>
      {!gameStarted && <StartGame onStartGame={startGame} onHighScores={showHighScorePage} />}
      
      {gameStarted && (
        <div>

{ /* difficulty radio switch */ }

          <div className="difficulty-selector">
            {difficultyOptions.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  value={option}
                  checked={difficulty === option}
                  onChange={() => setDifficulty(option)}
                />
                {option}
              </label>
            ))}
          </div>
          
{ /* refresh game button */ }

          <div className='button-container'>
            <button className='submit-button-m' onClick={generateNewGrid}>Restart</button>
          </div>

{ /* main game grid */ }

          <div className="grid-container">
            <div className="timer-score-container">
              <div className="timer-container">
                <p className='timer-text'>Time: {timer}</p>
              </div>
              <div className="score-container">
                <p className='timer-text'>Score: {score}</p>
              </div>
            </div>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`cell ${!cell.active ? 'inactive' : ''} ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flag' : ''}`}
                    onClick={() => handleClick(rowIndex, colIndex)}
                    onContextMenu={(event) => handleRightClick(event, rowIndex, colIndex)}
                  >
                    {cell.revealed ? cell.content : cell.flagged ? '🚩' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>

          { /* refresh game button */ }

<div className='button-container'>
<button className="submit-button-m" onClick={() => window.location.reload()}>Back to Menu</button>
</div>


        </div>
      )}
    </div>
  );
};

export default Grid;




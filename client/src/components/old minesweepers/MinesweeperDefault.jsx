import { useState, useEffect } from 'react';
import '../App.css'; // Assuming App.css is your stylesheet for styling

const Grid = () => {
  const rows = 10;
  const cols = 10;
  const maxReveal = 3; // Maximum surrounding safe cells to reveal

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], /* mine */ [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  const generateInitialGrid = () => {
    return Array(rows).fill().map((_, rowIndex) =>
      Array(cols).fill().map((_, colIndex) => ({
        id: rowIndex * cols + colIndex + 1,
        active: true,
        content: '',
        revealed: false, // Track if cell content has been revealed
        flagged: false // Track if cell has been flagged
      }))
    );
  };

  const [grid, setGrid] = useState(generateInitialGrid());
  const [nonBombCellsCount, setNonBombCellsCount] = useState(rows * cols - 20); // Total cells minus 20 bombs
  const [revealedNonBombCount, setRevealedNonBombCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleClick = (row, col) => {
    const cell = grid[row][col];
    if (!cell.active || cell.revealed) {
      return; // Do nothing if cell is inactive or already revealed
    }
    if (!isActive) {
      startTimer(); // Start the timer on the first click
    }
    const newGrid = [...grid];
    if (cell.content === 'X') {
      // Clicked on a bomb
      newGrid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell.content === 'X') {
            newGrid[rowIndex][colIndex].content = '💣';
            newGrid[rowIndex][colIndex].active = false;
            newGrid[rowIndex][colIndex].revealed = true;
            newGrid[rowIndex][colIndex].isBombClicked = true; // Mark bomb cell as clicked
          }
        });
      });

      setGrid(newGrid);

      setTimeout(() => {
        alert(`You activated a mine. Game Over. Score: ${score}, Time taken: ${timer} seconds`);
        generateNewGrid();
      }, 500);
    } else {
      // Clicked on a non-bomb cell
      const revealSafeCells = (r, c, cellsToReveal) => {
        if (newGrid[r][c].revealed || cellsToReveal === 0) return;

        newGrid[r][c].revealed = true;
        setRevealedNonBombCount(prevCount => prevCount + 1); // Increment count of revealed non-bomb cells
        setScore(prevScore => prevScore + 10); // Increase score when revealing a cell
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

      revealSafeCells(row, col, maxReveal);
      setGrid(newGrid);
    }
  };

  const handleRightClick = (event, row, col) => {
    event.preventDefault(); // Prevent the context menu from showing up
  
    if (!grid[row][col].active || grid[row][col].revealed) {
      return; // Do nothing if cell is inactive or already revealed
    }
  
    const newGrid = [...grid];
    newGrid[row][col].flagged = !newGrid[row][col].flagged; // Toggle flagged status
  
    setGrid(newGrid);
  };

  const generateNewGrid = () => {
    const newGrid = generateInitialGrid();

    const randomCells = [];
    while (randomCells.length < 20) {
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
    setScore(0); // Reset score
    setTimer(0); // Reset timer
    setIsActive(false); // Stop timer
  };

  const checkWinCondition = () => {
    if (revealedNonBombCount === nonBombCellsCount) {
      setIsActive(false); // Stop timer when game is won
      alert(`You won! Score: ${score}, Time taken: ${timer} seconds`);
    }
  };

  return (
    <div>
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
      <div className='button-container-z'>
        <button className='submit-button-m' onClick={generateNewGrid}>Restart</button>
      </div>
    </div>
  );
};

export default Grid;
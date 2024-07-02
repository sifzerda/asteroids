import '../App.css'; // Assuming App.css is your stylesheet for styling

const StartGame = ({ onStartGame, onHighScores }) => {
  return (
    <div className="grid-container">
      <h1 className='start'>Minesweeper</h1>
      <p className='black-text'>Click the button below to start the game</p>
      <button className="submit-button-m" onClick={onStartGame}>Start Game</button>
      <button className="submit-button-m" onClick={onHighScores}>High Scores</button>
    </div>
  );
};

export default StartGame;
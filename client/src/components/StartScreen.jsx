
const StartScreen = ({ onStart, onHighScores }) => {
  return (
    <div className="start-screen">
      <h1>Asteroids</h1>
      <p>Press any key to start</p>
      <button className="submit-button-m" onClick={onStart}>Start Game</button>
      <button className="submit-button-m" onClick={onHighScores}>High Scores</button>
    </div>
  );
};

export default StartScreen;
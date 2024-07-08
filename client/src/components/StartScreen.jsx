
const StartScreen = ({ onStart, onHighScores }) => {
  return (
    <div className="start-screen">
      <h1>Main Menu</h1>
      <p>Note: Users must first be logged in to submit their score to the high scores board</p>
      <button className="submit-button-m" onClick={onStart}>START GAME</button>
      <button className="submit-button-m" onClick={onHighScores}>HIGH SCORES</button>
    </div>
  );
};

export default StartScreen;
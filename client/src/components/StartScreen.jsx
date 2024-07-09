
const StartScreen = ({ onStart, onHighScores }) => {
  return (
    <div className="start-screen">
      <h1>Main Menu</h1>
      <p className='color'>You must be logged in to submit your highscore</p>
      <button className="submit-button-m" onClick={onStart}>START GAME</button>
      <button className="submit-button-m" onClick={onHighScores}>HIGH SCORES</button>
    </div>
  );
};

export default StartScreen;
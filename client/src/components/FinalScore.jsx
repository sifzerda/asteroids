import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_ME } from '../utils/queries';
import { SAVE_AST_SCORE } from '../utils/mutations'
import '../App.css';

const FinalScore = ({ score, time, onHighScores }) => {
    const [astPoints, setAstPoints] = useState(score);
    const [astTimeTaken, setAstTimeTaken] = useState(time);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); 
  
    const { data } = useQuery(QUERY_ME);
    const userId = data?.me?._id;
    const username = data?.me?.username || 'Anonymous';
  
    const [saveAstScore] = useMutation(SAVE_AST_SCORE);
  
    const handleSubmit = async () => {
      try {
        const { data } = await saveAstScore({
          variables: {
            userId,
            astPoints,
            astTimeTaken,
          },
        });
        console.log('Score saved:', data.saveAstScore);
        // Optionally, you can trigger some UI update or action upon successful save
        setShowSuccessMessage(true); // Show success message
      } catch (error) {
        console.error('Error saving score:', error);
        // Handle error state or display a message to the user
    alert ('There was an error saving your score', error);  
    }
    };
  
    return (
 
        <div className="grid-container">
          <h1 className='start'>Game Over</h1>
          <p className='black-text'>Your final score: {score}</p>
          <p className='black-text'>Time taken: {time} seconds</p>
    
          {/* Conditional rendering based on success message state */}
          {showSuccessMessage ? (
            <p className="success">Your score has been submitted!</p>
          ) : (
            Auth.loggedIn() ? (
              <button className="submit-button-m" onClick={handleSubmit}>
                Submit Score
              </button>
            ) : (
              <p className='black-text'>
                You must <Link to="/login">LOG IN</Link> or <Link to="/signup">SIGNUP</Link> to Submit a Score.
              </p>
            )
          )}
    
          <button className="submit-button-m" onClick={onHighScores}>
            High Scores
          </button>
    
          <button className="submit-button-m" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </div>
 
      );
    };
    
    export default FinalScore;
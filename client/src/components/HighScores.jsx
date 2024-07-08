import '../App.css'; // Assuming App.css is your stylesheet for styling
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from '../utils/queries';

const HighScores = () => {
  const { loading, data, error } = useQuery(QUERY_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data.users; // Extracting users from query data

  // Aggregate all mineScore entries with associated usernames
  let allScores = [];
  users.forEach(user => {
    user.astScore.forEach(score => {
      allScores.push({
        username: user.username,
        astPoints: score.astPoints,
      });
    });
  });

  // Sort combined scores by minePoints in descending order
  // If points are the same, then sort by mineTimeTaken in ascending order
  allScores.sort((a, b) => {
    if (b.astPoints !== a.astPoints) {
      return b.astPoints - a.astPoints; // Sort by points descending
    }
});

// Limit to top 20 scores
const top20Scores = allScores.slice(0, 20);

return (
    <div className="grid-container">
      <h1 className='end'>High Scores</h1>
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Score</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {top20Scores.map((score, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{score.astPoints}</td>
              <td>{score.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="submit-button-m" onClick={() => window.location.reload()}>Back</button>
    </div>
  );
};

export default HighScores;
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import '../App.css';
import '../asteroids.css';

const Profile = () => {
    const { loading, data, error } = useQuery(QUERY_ME);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const user = data?.me;
    const astScores = user?.astScore || [];

    // Sort scores by highest minePoints, and then by least time taken if points are tied
    const sortedScores = [...astScores].sort((a, b) => {
        if (b.astPoints !== a.astPoints) {
            return b.astPoints - a.astPoints; // Sort by points descending
        }
    });

    // Limit to 10 scores
    const limitedScores = sortedScores.slice(0, 10);

    return (
        <div className="profile-container">
            <div className="jumbo-bg-dark">
                <h1 className='jumbo-bg-dark-text'>{user.username}'s Profile</h1>
            </div>
            <p className='black-text'>Email: {user.email}</p>
            <p className="email-info">Note: Your email cannot be seen by other users</p>
            <h2 className='profile-text'>Your Minesweeper Highscores:</h2>
            
            {limitedScores.length === 0 ? (
                <p className="black-text">No high scores yet!</p>
            ) : (
                <table className="high-scores-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {limitedScores.map((score, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{score.astPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Profile;
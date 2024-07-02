// Asteroid.js

const Asteroid = ({ position }) => {
  const asteroidStyle = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '50px',
    height: '50px',
    backgroundColor: 'gray',
    borderRadius: '50%',
  };

  return <div className="asteroid" style={asteroidStyle}></div>;
};

export default Asteroid;
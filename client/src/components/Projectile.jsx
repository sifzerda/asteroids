const Projectile = ({ position }) => {
    const projectileStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '5px',
      height: '5px',
      backgroundColor: 'red',
    };
  
    return <div className="projectile" style={projectileStyle}></div>;
  };
  
  export default Projectile;
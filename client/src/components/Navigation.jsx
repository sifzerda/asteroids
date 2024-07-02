import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../utils/auth';
import '../App.css';

function Navigation() {
  const currentPage = useLocation().pathname;
  const isLoggedIn = Auth.loggedIn();

    // Function to determine active class based on current page
    function isActive(path) {
      return currentPage === path ? 'nav-link active' : 'nav-link';
    }

  // login condition //

  function showNavigation() {
    if (isLoggedIn) {
      return (
        <React.Fragment>
          <li className="nav-item">
            <Link to="/profile" className={isActive('/profile')}>
              PROFILE
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" onClick={() => Auth.logout()} className="nav-link">
              LOGOUT
            </Link>
          </li>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <li className="nav-item">
            <Link to="/signup" className={isActive('/signup')}>
              SIGNUP
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className={isActive('/login')}>
              LOGIN
            </Link>
          </li>
        </React.Fragment>
      );
    }
  }

  // end login condition function-----------------------------------------------//

// ------------------------------- MAIN NAVIGATION LINKS ------------------//

return (
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <Link to="/" className={isActive('/')}>
        GAME
      </Link>
    </li>



    {/* ---------------------------------- log in conditional function --------------------------------  */}

    {showNavigation()}

    {/* ----------------------------------end --------------------------------  */}

    </ul>
  );
}

export default Navigation;

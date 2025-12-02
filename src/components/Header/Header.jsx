import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

function Header() {
  const { logout } = useContext(UserContext);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/profile">My Profile</Link>
          </li>
          <li>
            <button type="button" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

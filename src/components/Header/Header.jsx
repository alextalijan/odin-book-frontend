import { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useContext(UserContext);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles['links-list']}>
          <li className={styles['link-listing']}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
          </li>
          <li className={styles['link-listing']}>
            <Link to="/search" className={styles.link}>
              Search
            </Link>
          </li>
          <li className={styles['link-listing']}>
            <Link to={`/users/${user.username}`} className={styles.link}>
              My Profile
            </Link>
          </li>
          <li className={styles['link-listing']}>
            <button type="button" onClick={logout} className={styles.link}>
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

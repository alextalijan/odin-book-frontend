import { useContext, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import UserContext from '../../contexts/UserContext';

function LoginPage() {
  const usernameId = useId();
  const passwordId = useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        return;
    }
  }

  function handleLogin(username, password) {
    fetch(import.meta.env.VITE_API + '/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setError(json.message);
        }

        // Remember the user in frontend
        login(json.user);

        // Navigate user to the home page
        navigate('/');
      })
      .catch((error) => setError(error.message));
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>Log In</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form}>
        <label htmlFor={usernameId} className={styles.label}>
          Username :
        </label>
        <input
          type="text"
          id={usernameId}
          name="username"
          value={username}
          onChange={handleInputChange}
          className={styles.input}
          autoComplete="off"
        />

        <label htmlFor={passwordId} className={styles.label}>
          Password &nbsp;:
        </label>
        <input
          type="password"
          id={passwordId}
          name="password"
          value={password}
          onChange={handleInputChange}
          className={styles.input}
        />

        <div className={styles['btn-container']}>
          <button
            type="button"
            className={styles['login-btn']}
            onClick={() => handleLogin(username, password)}
          >
            Log In
          </button>
        </div>
      </form>
      <p className={styles['register-msg']}>
        Don't have an account?&nbsp;{' '}
        <Link to="/register" className={styles['register-link']}>
          Register
        </Link>
        <button
          className={styles['guest-login-btn']}
          type="button"
          onClick={() => handleLogin('guest', 'guest')}
        >
          Guest Login
        </button>
      </p>
    </div>
  );
}

export default LoginPage;

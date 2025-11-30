import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

function LoginPage() {
  const usernameId = useId();
  const passwordId = useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <>
      <h1 className={styles.h1}>Log In</h1>
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
          <button type="button" className={styles['login-btn']}>
            Log In
          </button>
        </div>
      </form>
      <p className={styles['register-msg']}>
        Don't have an account?&nbsp;{' '}
        <Link to="/register" className={styles['register-link']}>
          Register
        </Link>
      </p>
    </>
  );
}

export default LoginPage;

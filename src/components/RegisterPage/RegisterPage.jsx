import styles from './RegisterPage.module.css';
import { useId, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const usernameId = useId();
  const passwordId = useId();
  const passwordConfirmationId = useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);

  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirmation':
        setPasswordConfirmation(value);
        break;
      default:
        return;
    }
  }

  function handleRegistration() {
    // Send the request to the browser
    fetch(import.meta.env.VITE_API + '/users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirmation,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setError(json.message);
        }

        // Log the user in the frontend
        login(json.user);

        // Redirect to index page
        navigate('/');
      })
      .catch((error) => setError(error.message));
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>Register</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form}>
        <label htmlFor={usernameId} className={styles.label}>
          Username
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
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
          Password
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
        </label>
        <input
          type="password"
          id={passwordId}
          name="password"
          value={password}
          onChange={handleInputChange}
          className={styles.input}
        />

        <label htmlFor={passwordConfirmationId} className={styles.label}>
          Confirm Password :
        </label>
        <input
          type="password"
          id={passwordConfirmationId}
          name="passwordConfirmation"
          value={passwordConfirmation}
          onChange={handleInputChange}
          className={styles.input}
        />

        <div className={styles['btn-container']}>
          <button
            type="button"
            className={styles['register-btn']}
            onClick={handleRegistration}
          >
            Register
          </button>
        </div>
      </form>
      <p className={styles['login-msg']}>
        Already have an account?&nbsp;{' '}
        <Link to="/login" className={styles['login-link']}>
          Log In
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;

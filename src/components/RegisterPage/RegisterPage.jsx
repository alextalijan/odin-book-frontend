import styles from './RegisterPage.module.css';
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const usernameId = useId();
  const passwordId = useId();
  const passwordConfirmationId = useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

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

  return (
    <>
      <h1 className={styles.h1}>Register</h1>
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
          <button type="button" className={styles['register-btn']}>
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
    </>
  );
}

export default RegisterPage;

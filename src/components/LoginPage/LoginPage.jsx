import { useId, useState } from 'react';

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
      <h1>Log In</h1>
      <form>
        <label htmlFor={usernameId}>Username :</label>
        <input
          type="text"
          id={usernameId}
          name="username"
          value={username}
          onChange={handleInputChange}
        />

        <label htmlFor={passwordId}>Password :</label>
        <input
          type="password"
          id={passwordId}
          name="password"
          value={password}
          onChange={handleInputChange}
        />

        <button type="button">Log In</button>
      </form>
    </>
  );
}

export default LoginPage;

import styles from './SearchPage.module.css';
import { useState } from 'react';
import SearchBox from '../SearchBox/SearchBox';

function SearchPage() {
  const [usernameInput, setUsernameInput] = useState('');
  const [accounts, setAccounts] = useState(null);

  function handleInput(event) {
    setUsernameInput(event.target.value);

    // If the input is empty, don't fetch
    if (event.target.value === '') {
      return setAccounts(null);
    }

    // Fetch the possible accounts with the inputed username
    fetch(
      import.meta.env.VITE_API + `/users/search?username=${event.target.value}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setAccounts(json.users);
      });
  }

  return (
    <>
      <h1 className={styles.h1}>Search Users</h1>
      <form className={styles.form}>
        <input
          type="text"
          name="username"
          value={usernameInput}
          onChange={handleInput}
          className={styles['username-input']}
          autoComplete="off"
        />
        {accounts && <SearchBox accounts={accounts} />}
      </form>
    </>
  );
}

export default SearchPage;

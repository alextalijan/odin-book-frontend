import styles from './SearchPage.module.css';
import { useEffect, useState } from 'react';
import AccountList from '../AccountList/AccountList';

function SearchPage() {
  const [usernameInput, setUsernameInput] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [refreshSearch, setRefreshSearch] = useState(false);

  function handleInput(event) {
    setUsernameInput(event.target.value);
  }

  useEffect(() => {
    // If the input is empty, don't fetch
    if (usernameInput === '') {
      return setAccounts(null);
    }

    // Fetch the possible accounts with the inputed username
    fetch(
      import.meta.env.VITE_API + `/users/search?username=${usernameInput}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setAccounts(json.users);
      });
  }, [refreshSearch, usernameInput]);

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
        {accounts && (
          <div className={styles['accounts-section']}>
            <AccountList
              accounts={accounts}
              refreshList={() => setRefreshSearch((prev) => !prev)}
            />
          </div>
        )}
      </form>
    </>
  );
}

export default SearchPage;

import styles from './SearchBox.module.css';

function SearchBox({ accounts }) {
  return (
    <ul className={styles.container}>
      {accounts.length === 0 ? (
        <li className={styles['no-accounts-msg']}>No accounts found.</li>
      ) : (
        accounts.map((account) => {
          return (
            <li key={account.id} className={styles.listing}>
              <span className={styles.username}>{account.username}</span>
              <button
                type="button"
                className={
                  account.isFollowed
                    ? `${styles.btn} ${styles['unfollow-btn']}`
                    : `${styles.btn} ${styles['follow-btn']}`
                }
              >
                {!account.isFollowed && 'Follow'}
              </button>
            </li>
          );
        })
      )}
    </ul>
  );
}

export default SearchBox;

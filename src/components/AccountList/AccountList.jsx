import styles from './AccountList.module.css';

// Components
import AccountListing from '../AccountListing/AccountListing';

function AccountList({ accounts, refreshSearch }) {
  return (
    <ul className={styles.container}>
      {accounts.length === 0 ? (
        <li className={styles['no-accounts-msg']}>No accounts found.</li>
      ) : (
        accounts.map((account) => {
          return (
            <AccountListing account={account} refreshSearch={refreshSearch} />
          );
        })
      )}
    </ul>
  );
}

export default AccountList;

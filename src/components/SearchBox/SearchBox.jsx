import styles from './SearchBox.module.css';
import { useState } from 'react';

function SearchBox({ accounts, refreshSearch }) {
  const [unfollowModal, setUnfollowModal] = useState(false);
  const [accountToUnfollow, setAccountToUnfollow] = useState(null);

  // Function that opens the unfollow modal
  function triggerUnfollowModal(account) {
    setAccountToUnfollow(account);
    setUnfollowModal(true);
  }

  // Function that sends a follow request to the server
  function sendFollowRequest(accountId) {}

  // Function that deletes the user from account's followers
  function unfollow(accountId) {
    fetch(import.meta.env.VITE_API + `/users/${accountId}/followers`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          alert(json.message);
        }

        // Trigger a reload of search
        refreshSearch();

        // Close the unfollow modal
        setUnfollowModal(false);
      })
      .catch((err) => alert(err.message));
  }

  return (
    <>
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
                  onClick={
                    account.isFollowed
                      ? () => triggerUnfollowModal(account)
                      : () => sendFollowRequest(account.id)
                  }
                >
                  {!account.isFollowed && 'Follow'}
                </button>
              </li>
            );
          })
        )}
      </ul>
      {unfollowModal && (
        <>
          <div className={styles['modal-backdrop']}></div>
          <div className={styles['unfollow-modal']}>
            <span className={styles['modal-question']}>
              Are you sure you want to unfollow{' '}
              <b>{accountToUnfollow.username}</b>?
            </span>
            <div className={styles['modal-btns']}>
              <button
                type="button"
                className={`${styles['modal-btn']} ${styles['modal-unfollow-btn']}`}
                onClick={() => unfollow(accountToUnfollow.id)}
              >
                Unfollow
              </button>
              <button
                type="button"
                className={`${styles['modal-btn']} ${styles['modal-no-btn']}`}
                onClick={() => {
                  setAccountToUnfollow(null);
                  setUnfollowModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SearchBox;

import styles from './SearchBox.module.css';
import { useState } from 'react';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';

function SearchBox({ accounts, refreshSearch }) {
  const [unfollowModal, setUnfollowModal] = useState(false);
  const [cancelRequestModal, setCancelRequestModal] = useState(false);
  const [accountToUnfollow, setAccountToUnfollow] = useState(null);

  // Function that opens the unfollow modal
  function triggerUnfollowModal(account) {
    setAccountToUnfollow(account);
    setUnfollowModal(true);
  }

  function triggerCancelRequestModal(account) {
    setAccountToUnfollow(account);
    setCancelRequestModal(true);
  }

  // Function that sends a follow request to the server
  function sendFollowRequest(accountId) {
    fetch(import.meta.env.VITE_API + `/users/${accountId}/follow-requests`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        refreshSearch();
      });
  }

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

  function cancelRequest(accountId) {
    fetch(import.meta.env.VITE_API + `/users/${accountId}/follow-requests`, {
      method: 'PUT',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        // Close the modal and refresh search
        refreshSearch();
        setCancelRequestModal(false);
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
                <div className={styles['avatar-container']}>
                  <img
                    className={styles.avatar}
                    src={
                      account.hasAvatar
                        ? getStorageUrl('avatar', account.id)
                        : getStorageUrl('avatar', 'default')
                    }
                    alt="avatar"
                  />
                </div>
                <Link
                  to={`/users/${account.username}`}
                  className={styles.username}
                >
                  {account.username}
                </Link>
                <button
                  type="button"
                  className={
                    account.isFollowed || account.requestSent
                      ? `${styles.btn} ${styles['unfollow-btn']}`
                      : `${styles.btn} ${styles['follow-btn']}`
                  }
                  onClick={
                    account.requestSent
                      ? () => triggerCancelRequestModal(account)
                      : account.isFollowed
                        ? () => triggerUnfollowModal(account)
                        : () => sendFollowRequest(account.id)
                  }
                >
                  {account.requestSent
                    ? 'Requested'
                    : !account.isFollowed
                      ? 'Follow'
                      : 'Following'}
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
      {cancelRequestModal && (
        <>
          <div className={styles['modal-backdrop']}></div>
          <div className={styles['unfollow-modal']}>
            <span className={styles['modal-question']}>
              Are you sure you want to cancel request to{' '}
              <b>{accountToUnfollow.username}</b>?
            </span>
            <div className={styles['modal-btns']}>
              <button
                type="button"
                className={`${styles['modal-btn']} ${styles['modal-unfollow-btn']}`}
                onClick={() => cancelRequest(accountToUnfollow.id)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles['modal-btn']} ${styles['modal-no-btn']}`}
                onClick={() => {
                  setAccountToUnfollow(null);
                  setCancelRequestModal(false);
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

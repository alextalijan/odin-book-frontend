import { useEffect, useState } from 'react';
import styles from './FollowingsModal.module.css';
import AccountList from '../AccountList/AccountList';
import { createPortal } from 'react-dom';

function FollowingsModal({ accountId, show, closeModal }) {
  const [followers, setFollowers] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followersError, setFollowersError] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [loadingFollowings, setLoadingFollowings] = useState(true);
  const [followingsError, setFollowingsError] = useState(null);
  const [showState, setShowState] = useState(show);
  const [reloadFollowers, setReloadFollowers] = useState(false);
  const [reloadFollowings, setReloadFollowings] = useState(false);

  // Fetch the list of followers
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${accountId}/followers`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setFollowersError(json.message);
        }

        setFollowers(json.followers);
      })
      .catch((err) => setFollowersError(err.message))
      .finally(() => setLoadingFollowers(false));
  }, [accountId, reloadFollowers]);

  // Fetch the list of followings
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${accountId}/followings`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setFollowingsError(json.message);
        }

        setFollowings(json.followings);
      })
      .catch((err) => setFollowingsError(err.message))
      .finally(() => setLoadingFollowings(false));
  }, [accountId, reloadFollowings]);

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button
            className={
              showState === 'followers'
                ? `${styles['header-btn']} ${styles['active-header-btn']}`
                : styles['header-btn']
            }
            onClick={() => setShowState('followers')}
          >
            {followers && followers.length} Followers
          </button>
          <button
            className={
              showState === 'following'
                ? `${styles['header-btn']} ${styles['active-header-btn']}`
                : styles['header-btn']
            }
            onClick={() => setShowState('following')}
          >
            {followings && followings.length} Following
          </button>
        </div>
        {showState === 'followers' ? (
          loadingFollowers ? (
            <div className={styles['loading-container']}>
              <img
                className={styles['loading-icon']}
                src="/public/icons/loading-icon.png"
              />
            </div>
          ) : followersError ? (
            <span className={styles.error}>{followersError}</span>
          ) : (
            <div className={styles['accounts-list']}>
              <AccountList
                accounts={followers}
                refreshList={() => setReloadFollowers((prev) => !prev)}
              />
            </div>
          )
        ) : showState === 'following' ? (
          loadingFollowings ? (
            <div className={styles['loading-container']}>
              <img
                className={styles['loading-icon']}
                src="/public/icons/loading-icon.png"
              />
            </div>
          ) : followingsError ? (
            <span className={styles.error}>{followingsError}</span>
          ) : (
            <div className={styles['accounts-list']}>
              <AccountList
                accounts={followings}
                refreshList={() => setReloadFollowings((prev) => !prev)}
              />
            </div>
          )
        ) : (
          <li>Invalid Request</li>
        )}
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default FollowingsModal;

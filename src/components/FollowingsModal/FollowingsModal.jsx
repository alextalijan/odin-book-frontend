import { useEffect, useState } from 'react';
import styles from './FollowingsModal.module.css';
import AccountListing from '../AccountListing/AccountListing';

function FollowingsModal({ accountId, show }) {
  const [followers, setFollowers] = useState(null);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [followersError, setFollowersError] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [loadingFollowings, setLoadingFollowings] = useState(true);
  const [followingsError, setFollowingsError] = useState(null);

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
  }, []);

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

        setFollowings(json.followers);
      })
      .catch((err) => setFollowingsError(err.message))
      .finally(() => setLoadingFollowings(false));
  }, []);

  return (
    <>
      <div className={styles.backdrop}></div>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button>Followers</button>
          <button>Following</button>
        </div>
        <hr />
        <ul className={styles['accounts-list']}>
          {show === 'followers' ? (
            loadingFollowers ? (
              <img src="/public/icons/loading-icon.png" />
            ) : followersError ? (
              <p>{followersError}</p>
            ) : (
              followers.map((follower) => {
                return <li key={follower.id}></li>;
              })
            )
          ) : (
            show === 'following'
          )}
        </ul>
      </div>
    </>
  );
}

export default FollowingsModal;

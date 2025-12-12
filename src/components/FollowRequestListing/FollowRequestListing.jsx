import styles from './FollowRequestListing.module.css';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';

function FollowRequestListing({ requestId, sender, refreshList }) {
  function handleFollowRequest(response) {
    const acceptableResponses = ['accepted', 'rejected'];

    // Check if response is acceptable
    if (!acceptableResponses.includes(response)) {
      throw new Error('Non acceptable response.');
    }

    fetch(import.meta.env.VITE_API + `/requests/${requestId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        // Refresh the list
        refreshList();
      })
      .catch((err) => alert(err.message));
  }

  return (
    <li className={styles.listing}>
      <div className={styles['avatar-container']}>
        <img
          className={styles.avatar}
          src={
            sender.hasAvatar
              ? getStorageUrl('avatar', sender.id)
              : getStorageUrl('avatar', 'default')
          }
          alt="avatar"
        />
      </div>
      <Link to={`/users/${sender.username}`} className={styles.username}>
        {sender.username}
      </Link>
      <div className={styles.btns}>
        <button
          className={`${styles.btn} ${styles['accept-btn']}`}
          type="button"
          onClick={() => handleFollowRequest('accepted')}
        >
          Accept
        </button>
        <button
          className={`${styles.btn} ${styles['decline-btn']}`}
          type="button"
          onClick={() => handleFollowRequest('rejected')}
        >
          Decline
        </button>
      </div>
    </li>
  );
}

export default FollowRequestListing;

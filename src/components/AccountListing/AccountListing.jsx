import styles from './AccountListing.module.css';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

// Components
import UnfollowModal from '../UnfollowModal/UnfollowModal';
import CancelRequestModal from '../CancelRequestModal/CancelRequestModal';
import UserContext from '../../contexts/UserContext';

function AccountListing({ account, refreshList }) {
  const [unfollowModal, setUnfollowModal] = useState(false);
  const [cancelRequestModal, setCancelRequestModal] = useState(false);
  const { user } = useContext(UserContext);

  // Function that sends a follow request to the server
  function sendFollowRequest() {
    fetch(import.meta.env.VITE_API + `/users/${account.id}/follow-requests`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        refreshList();
      });
  }

  return (
    <>
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
        <Link to={`/users/${account.username}`} className={styles.username}>
          {account.username}
        </Link>
        {account.id !== user.id && (
          <button
            type="button"
            className={
              account.isFollowed || account.requestSent
                ? `${styles.btn} ${styles['unfollow-btn']}`
                : `${styles.btn} ${styles['follow-btn']}`
            }
            onClick={
              account.requestSent
                ? () => setCancelRequestModal(true)
                : account.isFollowed
                  ? () => setUnfollowModal(true)
                  : () => sendFollowRequest()
            }
          >
            {account.requestSent
              ? 'Requested'
              : !account.isFollowed
                ? 'Follow'
                : 'Following'}
          </button>
        )}
      </li>
      {unfollowModal && (
        <UnfollowModal
          accountToUnfollow={account}
          refreshList={refreshList}
          closeModal={() => setUnfollowModal(false)}
        />
      )}
      {cancelRequestModal && (
        <CancelRequestModal
          accountToCancel={account}
          refreshList={refreshList}
          closeModal={() => setCancelRequestModal(false)}
        />
      )}
    </>
  );
}

export default AccountListing;

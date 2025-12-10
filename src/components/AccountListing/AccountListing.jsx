import styles from './AccountListing.module.css';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';

function AccountListing({
  account,
  openUnfollowModal,
  openCancelRequestModal,
  accountToModify,
  refreshSearch,
}) {
  // Function that opens the unfollow modal
  function triggerUnfollowModal() {
    accountToModify(account);
    openUnfollowModal();
  }

  // Function that opens the cancel request modal
  function triggerCancelRequestModal() {
    accountToModify(account);
    openCancelRequestModal();
  }

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

        refreshSearch();
      });
  }

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
      <Link to={`/users/${account.username}`} className={styles.username}>
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
            ? () => triggerCancelRequestModal()
            : account.isFollowed
              ? () => triggerUnfollowModal()
              : () => sendFollowRequest()
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
}

export default AccountListing;

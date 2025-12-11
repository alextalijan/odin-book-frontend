import { createPortal } from 'react-dom';
import styles from './UnfollowModal.module.css';

function UnfollowModal({ accountToUnfollow, refreshList, closeModal }) {
  // Function that deletes the user from account's followers
  function unfollow() {
    fetch(
      import.meta.env.VITE_API + `/users/${accountToUnfollow.id}/followers`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          alert(json.message);
        }

        // Trigger a reload of search
        refreshList();

        // Close the unfollow modal
        closeModal();
      })
      .catch((err) => alert(err.message));
  }

  return createPortal(
    <>
      <div className={styles['modal-backdrop']}></div>
      <div className={styles['unfollow-modal']}>
        <span className={styles['modal-question']}>
          Are you sure you want to unfollow <b>{accountToUnfollow.username}</b>?
        </span>
        <div className={styles['modal-btns']}>
          <button
            type="button"
            className={`${styles['modal-btn']} ${styles['modal-unfollow-btn']}`}
            onClick={unfollow}
          >
            Unfollow
          </button>
          <button
            type="button"
            className={`${styles['modal-btn']} ${styles['modal-no-btn']}`}
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default UnfollowModal;

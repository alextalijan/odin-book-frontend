import styles from './CancelRequestModal.module.css';
import { createPortal } from 'react-dom';

function CancelRequestModal({ accountToCancel, refreshList, closeModal }) {
  // Function that cancels a follow request
  function cancelRequest() {
    fetch(
      import.meta.env.VITE_API + `/users/${accountToCancel.id}/follow-requests`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        // Close the modal and refresh search
        refreshList();
        closeModal();
      })
      .catch((err) => alert(err.message));
  }

  return createPortal(
    <>
      <div className={styles['modal-backdrop']}></div>
      <div className={styles['cancel-modal']}>
        <span className={styles['modal-question']}>
          Are you sure you want to cancel request to{' '}
          <b>{accountToCancel.username}</b>?
        </span>
        <div className={styles['modal-btns']}>
          <button
            type="button"
            className={`${styles['modal-btn']} ${styles['modal-cancel-btn']}`}
            onClick={() => cancelRequest(accountToCancel.id)}
          >
            Cancel
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

export default CancelRequestModal;

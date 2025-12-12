import styles from './FollowRequestsModal.module.css';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import FollowRequestsList from '../FollowRequestsList/FollowRequestsList';

function FollowRequestsModal({ user, closeModal }) {
  const [requests, setRequests] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState(null);
  const [reloadList, setReloadList] = useState(false);

  // Fetch the follow requests
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${user.id}/follow-requests`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setRequestsError(json.message);
        }

        setRequests(json.requests);
      })
      .catch((err) => setRequestsError(err.message))
      .finally(() => setLoadingRequests(false));
  }, [reloadList]);

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <h2 className={styles['modal-heading']}>Follow Requests</h2>
        {loadingRequests ? (
          <div className={styles['loading-container']}>
            <img
              className={styles['loading-icon']}
              src="/icons/loading-icon.png"
            />
          </div>
        ) : requestsError ? (
          <p className={styles.error}>{requestsError}</p>
        ) : requests.length === 0 ? (
          <p className={styles['no-requests-msg']}>No requests at this time.</p>
        ) : (
          <div className={styles['requests-section']}>
            <FollowRequestsList
              requests={requests}
              refreshList={() => setReloadList((prev) => !prev)}
            />
          </div>
        )}
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default FollowRequestsModal;

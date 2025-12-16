import { useContext, useState } from 'react';
import styles from './ChangeAvatarModal.module.css';
import { createPortal } from 'react-dom';
import UserContext from '../../contexts/UserContext';

function ChangeAvatarModal({ closeModal }) {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  function handleFileUpload(event) {
    setFile(event.target.files[0]);
  }

  function handleAvatarChange(action) {
    // Set up data in a way it can be read by multer and express in backend
    const formData = new FormData();
    formData.append('action', action);
    formData.append('avatar', file || null);

    fetch(import.meta.env.VITE_API + `/users/${user.id}/avatar`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setError(json.message);
        }

        closeModal();
      })
      .catch((err) => setError(err.message));
  }

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Change Avatar</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form}>
          <div className={styles['input-container']}>
            <label className={styles['input-label']} htmlFor="avatar-file">
              Avatar:
            </label>
            <input
              type="file"
              id="avatar-file"
              className={styles.input}
              onChange={handleFileUpload}
            />
          </div>
          <div className={styles.btns}>
            <button
              className={`${styles.btn} ${styles['change-btn']}`}
              type="button"
              onClick={() => handleAvatarChange('change')}
            >
              Change
            </button>
            <button
              className={`${styles.btn} ${styles['remove-btn']}`}
              type="button"
              onClick={() => handleAvatarChange('remove')}
            >
              Remove Avatar
            </button>
          </div>
        </form>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default ChangeAvatarModal;

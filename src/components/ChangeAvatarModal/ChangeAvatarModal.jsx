import styles from './ChangeAvatarModal.module.css';
import { createPortal } from 'react-dom';

function ChangeAvatarModal({ closeModal }) {
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Change Avatar</h2>
        <form className={styles.form}>
          <div className={styles['input-container']}>
            <label className={styles['input-label']} htmlFor="avatar-file">
              Avatar:
            </label>
            <input type="file" id="avatar-file" className={styles.input} />
          </div>
          <div className={styles.btns}>
            <button
              className={`${styles.btn} ${styles['change-btn']}`}
              type="button"
            >
              Change
            </button>
            <button
              className={`${styles.btn} ${styles['remove-btn']}`}
              type="button"
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

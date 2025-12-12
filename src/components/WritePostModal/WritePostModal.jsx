import styles from './WritePostModal.module.css';
import { createPortal } from 'react-dom';

function WritePostModal({ closeModal }) {
  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Write Post</h2>
        <form className={styles.form}>
          <textarea
            className={styles['post-content']}
            name="content"
          ></textarea>
          <button type="button" className={styles['post-btn']}>
            Post
          </button>
        </form>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default WritePostModal;

import styles from './WritePostModal.module.css';
import { createPortal } from 'react-dom';
import { useState } from 'react';

function WritePostModal({ closeModal, refreshPosts }) {
  const [postContent, setPostContent] = useState('');
  const [postError, setPostError] = useState(null);

  function handleInput(event) {
    setPostContent(event.target.value);
  }

  const post = function thatSendsPostToTheDatabase() {
    // If the content is empty, don't send anything
    if (postContent.trim() === '') return;

    fetch(import.meta.env.VITE_API + '/posts', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: postContent,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setPostError(json.message);
        }

        closeModal();
        refreshPosts();
      })
      .catch((err) => setPostError(err.message));
  };

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={closeModal}></div>
      <div className={styles.modal}>
        <h2 className={styles.heading}>Write Post</h2>
        {postError && <p className={styles.error}>{postError}</p>}
        <form className={styles.form}>
          <textarea
            className={styles['post-content']}
            name="content"
            value={postContent}
            onChange={handleInput}
          ></textarea>
          <button onClick={post} type="button" className={styles['post-btn']}>
            Post
          </button>
        </form>
      </div>
    </>,
    document.getElementById('modal-root')
  );
}

export default WritePostModal;

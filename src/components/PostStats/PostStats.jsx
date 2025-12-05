import styles from './PostStats.module.css';
import { useState } from 'react';

function PostStats({ postId, isLiked, numLikes, numComments }) {
  const [liked, setLiked] = useState(isLiked);
  const [likesNum, setLikesNum] = useState(numLikes);

  function likePost() {
    fetch(import.meta.env.VITE_API + `/posts/${postId}/likes`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        setLiked(true);
        setLikesNum((prev) => prev + 1);
      })
      .catch((err) => alert(err.message));
  }

  function unlikePost() {
    fetch(import.meta.env.VITE_API + `/posts/${postId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        setLiked(false);
        setLikesNum((prev) => prev - 1);
      })
      .catch((err) => alert(err.message));
  }

  return (
    <div className={styles.container}>
      <span className={styles.likes}>
        {likesNum}{' '}
        <button
          className={styles['like-btn']}
          onClick={liked ? unlikePost : likePost}
        >
          <img
            className={styles['like-icon']}
            src={
              liked ? '/public/icons/liked.png' : '/public/icons/not-liked.png'
            }
            alt="like icon"
          />
        </button>
      </span>
      <button className={styles.comments}>
        {numComments}{' '}
        <img
          className={styles['comments-icon']}
          src="/public/icons/comment.png"
          alt="comments icon"
        />
      </button>
    </div>
  );
}

export default PostStats;

import styles from './Post.module.css';
import formatDate from '../../utils/formatDate';
import { useState } from 'react';

function Post({
  id,
  text,
  author,
  numLikes,
  numComments,
  postedAt,
  comments,
  isLiked,
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likesNum, setLikesNum] = useState(numLikes);

  function likePost() {
    fetch(import.meta.env.VITE_API + `/posts/${id}/likes`, {
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
    fetch(import.meta.env.VITE_API + `/posts/${id}/likes`, {
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
    <div className={styles.card}>
      <span className={styles.author}>{author}</span>
      <p className={styles.content}>{text}</p>
      <div className={styles['post-footer']}>
        <div className={styles['post-info']}>
          <span className={styles.likes}>
            {likesNum}{' '}
            <button
              className={styles['like-btn']}
              onClick={liked ? unlikePost : likePost}
            >
              <img
                className={styles['like-icon']}
                src={
                  liked
                    ? '/public/icons/liked.png'
                    : '/public/icons/not-liked.png'
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
        <p className={styles['post-date']}>{formatDate(postedAt)}</p>
      </div>
      {comments.length > 0 && (
        <div className={styles['latest-comments']}>
          <span className={styles['comments-heading']}>Latest Comments</span>
          <ul className={styles['comments-list']}>
            {comments.map((comment) => {
              return (
                <li key={comment.id} className={styles.comment}>
                  <span>
                    <b>{comment.author.username}</b> : {comment.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Post;

import styles from './Post.module.css';
import formatDate from '../../utils/formatDate';

function Post({ text, author, numLikes, numComments, postedAt }) {
  return (
    <div className={styles.card}>
      <span className={styles.author}>{author}</span>
      <p className={styles.content}>{text}</p>
      <div className={styles['post-footer']}>
        <div className={styles['post-info']}>
          <span className={styles.likes}>
            {numLikes}{' '}
            <button className={styles['like-btn']}>
              <img
                className={styles['like-icon']}
                src={'/public/icons/not-liked.png'}
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
    </div>
  );
}

export default Post;

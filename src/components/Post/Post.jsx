import styles from './Post.module.css';
import formatDate from '../../utils/formatDate';
import PostStats from '../PostStats/PostStats';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';

function Post({
  id,
  text,
  author,
  numLikes,
  numComments,
  postedAt,
  comments,
  isLiked,
  open,
  includeAccountLink = false,
}) {
  return (
    <div className={styles.card}>
      <div className={styles['author-section']}>
        <div className={styles['avatar-container']}>
          <img
            className={styles.avatar}
            src={
              author.hasAvatar
                ? getStorageUrl('avatar', author.id)
                : getStorageUrl('avatar', 'default')
            }
            alt="avatar"
          />
        </div>
        {includeAccountLink ? (
          <Link
            to={`/users/${author.username}`}
            className={`${styles.author} ${styles.link}`}
          >
            {author.username}
          </Link>
        ) : (
          <span to={`/users/${author.username}`} className={styles.author}>
            {author.username}
          </span>
        )}
      </div>
      <pre className={styles.content}>{text}</pre>
      <hr className={styles.separator} />
      <div className={styles['post-footer']}>
        <PostStats
          postId={id}
          isLiked={isLiked}
          numLikes={numLikes}
          numComments={numComments}
          openPost={open}
        />
        <p className={styles['post-date']}>{formatDate(postedAt)}</p>
      </div>
      {comments.length > 0 && (
        <div className={styles['latest-comments']}>
          <button className={styles['comments-heading']} onClick={open}>
            Latest Comments
          </button>
          <ul className={styles['comments-list']}>
            {comments.map((comment) => {
              return (
                <li key={comment.id} className={styles.comment}>
                  <span>
                    <b>
                      <Link
                        className={styles['commenter-link']}
                        to={`/users/${comment.author.username}`}
                      >
                        {comment.author.username}
                      </Link>
                    </b>{' '}
                    :{' '}
                    <pre className={styles['comment-content']}>
                      {comment.text}
                    </pre>
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

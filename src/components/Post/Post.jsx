import styles from './Post.module.css';
import formatDate from '../../utils/formatDate';
import PostStats from '../PostStats/PostStats';
import getStorageUrl from '../../utils/getStorageUrl';

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
        <span className={styles.author}>{author.username}</span>
      </div>
      <p className={styles.content}>{text}</p>
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

import styles from './Post.module.css';
import formatDate from '../../utils/formatDate';
import PostStats from '../PostStats/PostStats';

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
      <span className={styles.author}>{author}</span>
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

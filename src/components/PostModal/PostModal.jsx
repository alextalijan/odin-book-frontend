import { useEffect, useState, useRef } from 'react';
import styles from './PostModal.module.css';
import PostStats from '../PostStats/PostStats';
import formatDate from '../../utils/formatDate';

function PostModal({ postId, close }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const commentsPageNum = useRef(1);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  // TODO: write fetch logic for loading more comments
  // Fetch the post details
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setPostError(json.message);
        }

        setPost(json.post);
      })
      .catch((err) => setPostError(err.message))
      .finally(() => setLoadingPost(false));
  }, [postId]);

  // Fetch post comments
  useEffect(() => {
    fetch(
      import.meta.env.VITE_API +
        `/posts/${postId}/comments?pageNum=${commentsPageNum.current}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setCommentsError(json.message);
        }

        setComments(json.comments);
      })
      .catch((err) => setCommentsError(err.message))
      .finally(() => setLoadingComments(false));
  }, [postId]);

  return (
    <>
      <div className={styles.backdrop} onClick={close}></div>
      <div className={styles.post}>
        {loadingPost ? (
          <img
            className={styles['loading-icon']}
            src="/public/icons/loading-icon.png"
            alt=""
          />
        ) : postError ? (
          <span className={styles.error}>{postError}</span>
        ) : (
          <>
            <span className={styles.author}>{post.author.username}</span>
            <p className={styles.content}>{post.text}</p>
            <div className={styles['post-footer']}>
              <PostStats
                postId={post.id}
                isLiked={post.isLiked}
                numLikes={post._count.likes}
                numComments={post._count.comments}
              />
              <span className={styles['post-date']}>
                {formatDate(post.postedAt)}
              </span>
            </div>
            <hr />
            <span className={styles['comments-heading']}>Comments</span>
            <div className={styles['comments-list']}>
              {loadingComments ? (
                <img
                  className={`${styles['loading-icon']} ${styles['comments-loading-icon']}`}
                  src="/public/icons/loading-icon.png"
                  alt=""
                />
              ) : commentsError ? (
                <p className={styles['comments-error']}>{commentsError}</p>
              ) : comments.length === 0 ? (
                <p className={styles['no-comments-msg']}>No comments yet.</p>
              ) : (
                comments.map((comment) => {
                  return (
                    <div key={comment.id} className={styles.comment}>
                      <span className={styles['comment-author']}>
                        {comment.author.username}
                      </span>
                      <p className={styles['comment-content']}>
                        {comment.text}
                      </p>
                      <span className={styles['comment-date']}>
                        {formatDate(comment.commentedAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PostModal;

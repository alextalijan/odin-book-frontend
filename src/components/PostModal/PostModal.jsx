import { useEffect, useState, useRef } from 'react';
import styles from './PostModal.module.css';
import PostStats from '../PostStats/PostStats';
import formatDate from '../../utils/formatDate';
import getStorageUrl from '../../utils/getStorageUrl';
import { Link } from 'react-router-dom';

function PostModal({ postId, close, includeAccountLink = false }) {
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);
  const [commentsNum, setCommentsNum] = useState(null);
  const commentsPageNum = useRef(1);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [loadMoreComments, setLoadMoreComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [refreshComments, setRefreshComments] = useState(false);

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
        setCommentsNum(json.post._count.comments);
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
  }, [postId, loadMoreComments, refreshComments]);

  function handleScroll(event) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    // If the user has reached the bottom
    if (scrollTop + 1 > scrollHeight - clientHeight) {
      // Load more messages
      commentsPageNum.current += 1;
      setLoadMoreComments((prev) => !prev);
    }
  }

  function handleCommentInput(event) {
    setCommentInput(event.target.value);
  }

  const sendComment = function thatPostsCommentToTheServer() {
    // If comment is empty, don't send it
    if (commentInput === '') return;

    fetch(import.meta.env.VITE_API + `/posts/${postId}/comments`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentInput,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return alert(json.message);
        }

        // Load the new comment
        setCommentsNum((prev) => prev + 1);
        setRefreshComments((prev) => !prev);
        setCommentInput('');
      })
      .catch((err) => alert(err.message));
  };

  return (
    <>
      <div className={styles.backdrop} onClick={close}></div>
      <div className={styles.post} onScroll={handleScroll}>
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
            <div className={styles['author-section']}>
              <div className={styles['avatar-container']}>
                <img
                  className={styles.avatar}
                  src={
                    post.author.hasAvatar
                      ? getStorageUrl('avatar', post.author.id)
                      : getStorageUrl('avatar', 'default')
                  }
                  alt="avatar"
                />
              </div>
              {includeAccountLink ? (
                <Link
                  to={`/users/${post.author.username}`}
                  className={`${styles.author} ${styles.link}`}
                >
                  {post.author.username}
                </Link>
              ) : (
                <span className={styles.author}>{post.author.username}</span>
              )}
            </div>
            <p className={styles.content}>{post.text}</p>
            <div className={styles['post-footer']}>
              <PostStats
                postId={post.id}
                isLiked={post.isLiked}
                numLikes={post._count.likes}
                numComments={commentsNum}
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
                <>
                  <form className={styles['add-comment-form']}>
                    <textarea
                      className={styles['comment-input']}
                      name="comment"
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={handleCommentInput}
                    ></textarea>
                    <button
                      type="button"
                      className={styles['send-comment-btn']}
                      onClick={sendComment}
                    >
                      <img
                        src="/public/icons/send-comment.png"
                        alt="send comment"
                        className={styles['send-icon']}
                      />
                    </button>
                  </form>
                  {comments.map((comment) => {
                    return (
                      <div key={comment.id} className={styles.comment}>
                        <div className={styles['comment-author-section']}>
                          <div className={styles['commenter-avatar-container']}>
                            <img
                              className={styles['commenter-avatar']}
                              src={
                                comment.author.hasAvatar
                                  ? getStorageUrl('avatar', comment.author.id)
                                  : getStorageUrl('avatar', 'default')
                              }
                              alt="avatar"
                            />
                          </div>
                          <Link
                            to={`/users/${comment.author.username}`}
                            className={styles['comment-author']}
                          >
                            {comment.author.username}
                          </Link>
                        </div>
                        <p className={styles['comment-content']}>
                          {comment.text}
                        </p>
                        <span className={styles['comment-date']}>
                          {formatDate(comment.commentedAt)}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PostModal;

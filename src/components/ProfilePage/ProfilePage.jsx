import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useContext, useEffect, useState, useRef } from 'react';
import getStorageUrl from '../../utils/getStorageUrl';
import UserContext from '../../contexts/UserContext';
import Post from '../Post/Post';
import PostModal from '../PostModal/PostModal';
import FollowingsModal from '../FollowingsModal/FollowingsModal';

function ProfilePage() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [accountError, setAccountError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const pageNum = useRef(1);
  const [openPostId, setOpenPostId] = useState(null);
  const [loadPosts, setLoadPosts] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followingModalShow, setFollowingModalShow] = useState(null);

  // Fetch info about the account
  useEffect(() => {
    fetch(import.meta.env.VITE_API + `/users/${username}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setAccountError(json.message);
        }

        setAccount(json.account);
      })
      .catch((err) => setAccountError(err.message))
      .finally(() => setLoadingAccount(false));
  }, [username]);

  // Fetch the posts of the account
  useEffect(() => {
    // If there is not account
    // Or the account is not followed
    // Or the account is not the user
    if (
      !account ||
      (!account.isFollowed && account.username !== user.username)
    ) {
      // Don't fetch anything
      return;
    }

    fetch(
      import.meta.env.VITE_API +
        `/users/${account.id}/posts?page=${pageNum.current}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          return setPostsError(json.message);
        }

        setPosts(json.posts);
      })
      .catch((err) => setPostsError(err.message))
      .finally(() => setLoadingPosts(false));
  }, [account, loadPosts]);

  // If the scroll has reached the bottom, trigger loading more posts
  useEffect(() => {
    if (!window) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 5) {
        pageNum.current += 1;
        setLoadPosts((prev) => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {loadingAccount ? (
        <div className={styles['loading-container']}>
          <img
            className={styles['loading-icon']}
            src="/public/icons/loading-icon.png"
          />
        </div>
      ) : accountError ? (
        <p className={styles.error}>{accountError}</p>
      ) : (
        <>
          {(account.isFollowed || account.id === user.id) &&
            followingModalOpen && (
              <FollowingsModal
                accountId={account.id}
                show={followingModalShow}
              />
            )}
          <div className={styles['account-name']}>
            <div className={styles['avatar-container']}>
              <img
                className={styles.avatar}
                src={
                  account.hasAvatar
                    ? getStorageUrl('avatar', account.id)
                    : getStorageUrl('avatar', 'default')
                }
                alt=""
              />
            </div>
            <h1 className={styles.username}>{username}</h1>
          </div>
          <div className={styles['account-section']}>
            <div className={styles['account-stats']}>
              <span className={styles['account-posts']}>
                <b>{account._count.posts}</b>&nbsp; posts
              </span>
              <button className={styles['following-btn']} type="button">
                <b>{account._count.followers}</b>&nbsp; followers
              </button>
              <button className={styles['following-btn']} type="button">
                <b>{account._count.following}</b>&nbsp; following
              </button>
              {account.username !== user.username && (
                <button
                  className={
                    account.isFollowed
                      ? styles['unfollow-btn']
                      : styles['follow-btn']
                  }
                >
                  {account.isFollowed
                    ? 'Following'
                    : account.requestSent
                      ? 'Requested'
                      : 'Follow'}
                </button>
              )}
            </div>
            {account.id === user.id && (
              <button className={styles['requests-btn']}>
                <b>{account._count.incomingRequests}</b>&nbsp; follow{' '}
                {account._count.incomingRequests === 1 ? 'request' : 'requests'}
              </button>
            )}
          </div>
          {!account.isFollowed && account.username !== user.username ? (
            <div className={styles['follow-section']}>
              <p className={styles['follow-msg']}>
                Follow this person to see their posts.
              </p>
              <img
                className={styles['lock-icon']}
                src="/public/icons/lock.png"
                alt=""
              />
            </div>
          ) : (
            <>
              <h2 className={styles['posts-heading']}>Posts</h2>
              {loadingPosts ? (
                <div className={styles['posts-loading-container']}>
                  <img
                    className={styles['posts-loading-icon']}
                    src="/public/icons/loading-icon.png"
                  />
                </div>
              ) : postsError ? (
                <p className={styles['posts-error']}>{postsError}</p>
              ) : posts.length === 0 ? (
                <p className={styles['no-posts-msg']}>
                  This account doesn't have any posts.
                </p>
              ) : (
                <>
                  <div className={styles['posts']}>
                    {posts.map((post) => {
                      return (
                        <Post
                          key={post.id}
                          id={post.id}
                          text={post.text}
                          author={post.author}
                          numLikes={post._count.likes}
                          numComments={post._count.comments}
                          postedAt={post.postedAt}
                          comments={post.comments}
                          isLiked={post.isLiked}
                          open={() => setOpenPostId(post.id)}
                        />
                      );
                    })}
                  </div>
                  {openPostId && (
                    <PostModal
                      postId={openPostId}
                      close={() => setOpenPostId(null)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default ProfilePage;

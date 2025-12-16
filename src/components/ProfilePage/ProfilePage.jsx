import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useContext, useEffect, useState, useRef } from 'react';
import getStorageUrl from '../../utils/getStorageUrl';
import UserContext from '../../contexts/UserContext';
import Post from '../Post/Post';
import PostModal from '../PostModal/PostModal';
import FollowingsModal from '../FollowingsModal/FollowingsModal';
import UnfollowModal from '../UnfollowModal/UnfollowModal';
import CancelRequestModal from '../CancelRequestModal/CancelRequestModal';
import sendFollowRequest from '../../utils/sendFollowRequest';
import FollowRequestsModal from '../FollowRequestsModal/FollowRequestsModal';
import ChangeAvatarModal from '../ChangeAvatarModal/ChangeAvatarModal';

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
  const [unfollowModalOpen, setUnfollowModalOpen] = useState(false);
  const [cancelRequestModalOpen, setCancelRequestModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followingModalShow, setFollowingModalShow] = useState(null);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [changeAvatarModalOpen, setChangeAvatarModalOpen] = useState(false);

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

  // When the account has changed, close the followings modal
  useEffect(() => {
    setFollowingModalOpen(false);
  }, [account]);

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
            src="/icons/loading-icon.png"
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
                closeModal={() => setFollowingModalOpen(false)}
              />
            )}
          <div className={styles['account-name']}>
            {account.id === user.id ? (
              <button
                className={`${styles['avatar-container']} ${styles['avatar-btn']}`}
                onClick={() => setChangeAvatarModalOpen(true)}
              >
                <img
                  className={styles.avatar}
                  src={
                    account.hasAvatar
                      ? getStorageUrl('avatar', account.id)
                      : getStorageUrl('avatar', 'default')
                  }
                  alt=""
                />
                <div className={styles['avatar-edit-span-container']}>
                  <span className={styles['avatar-edit-span']}>Edit</span>
                </div>
              </button>
            ) : (
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
            )}
            <h1 className={styles.username}>{username}</h1>
          </div>
          <div className={styles['account-section']}>
            <div className={styles['account-stats']}>
              <span className={styles['account-posts']}>
                <b>{account._count.posts}</b>&nbsp; posts
              </span>
              <button
                className={styles['following-btn']}
                type="button"
                onClick={() => {
                  setFollowingModalOpen(true);
                  setFollowingModalShow('followers');
                }}
              >
                <b>{account._count.followers}</b>&nbsp; followers
              </button>
              <button
                className={styles['following-btn']}
                type="button"
                onClick={() => {
                  setFollowingModalOpen(true);
                  setFollowingModalShow('following');
                }}
              >
                <b>{account._count.following}</b>&nbsp; following
              </button>
              {account.username !== user.username && (
                <>
                  <button
                    className={
                      account.isFollowed || account.requestSent
                        ? styles['unfollow-btn']
                        : styles['follow-btn']
                    }
                    onClick={
                      account.isFollowed
                        ? () => setUnfollowModalOpen(true)
                        : account.requestSent
                          ? () => setCancelRequestModalOpen(true)
                          : () =>
                              sendFollowRequest(account.id, () =>
                                setAccount({ ...account, requestSent: true })
                              )
                    }
                  >
                    {account.isFollowed
                      ? 'Following'
                      : account.requestSent
                        ? 'Requested'
                        : 'Follow'}
                  </button>
                  {unfollowModalOpen && (
                    <UnfollowModal
                      accountToUnfollow={account}
                      refreshList={() =>
                        setAccount({ ...account, isFollowed: false })
                      }
                      closeModal={() => setUnfollowModalOpen(false)}
                    />
                  )}
                  {cancelRequestModalOpen && (
                    <CancelRequestModal
                      accountToCancel={account}
                      refreshList={() =>
                        setAccount({ ...account, requestSent: false })
                      }
                      closeModal={() => setCancelRequestModalOpen(false)}
                    />
                  )}
                </>
              )}
            </div>
            {account.id === user.id && (
              <>
                <button
                  className={styles['requests-btn']}
                  onClick={() => setRequestsModalOpen(true)}
                >
                  <b>{account._count.incomingRequests}</b>&nbsp; follow{' '}
                  {account._count.incomingRequests === 1
                    ? 'request'
                    : 'requests'}
                </button>
                {requestsModalOpen && (
                  <FollowRequestsModal
                    user={user}
                    closeModal={() => setRequestsModalOpen(false)}
                  />
                )}
                {changeAvatarModalOpen && (
                  <ChangeAvatarModal
                    closeModal={() => setChangeAvatarModalOpen(false)}
                  />
                )}
              </>
            )}
          </div>
          {!account.isFollowed && account.username !== user.username ? (
            <div className={styles['follow-section']}>
              <p className={styles['follow-msg']}>
                Follow this person to see their posts.
              </p>
              <img
                className={styles['lock-icon']}
                src="/icons/lock.png"
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
                    src="/icons/loading-icon.png"
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
                          containsImage={post.containsImage}
                          open={() => setOpenPostId(post.id)}
                        />
                      );
                    })}
                  </div>
                  {openPostId && (
                    <PostModal
                      postId={openPostId}
                      close={() => setOpenPostId(null)}
                      refreshPosts={() => setLoadPosts((prev) => !prev)}
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

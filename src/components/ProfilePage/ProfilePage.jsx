import { useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { useContext, useEffect, useState } from 'react';
import getStorageUrl from '../../utils/getStorageUrl';
import UserContext from '../../contexts/UserContext';
import Post from '../Post/Post';

function ProfilePage() {
  const { user } = useContext(UserContext);
  const { username } = useParams();
  const [account, setAccount] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [accountError, setAccountError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);

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
  }, []);

  // Fetch the posts of the account
  // useEffect(() => {
  //   fetch(import.meta.env.VITE_API + '/users/:username/posts', {
  //     method: 'GET',
  //   })
  // }, [account]);

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
          <div className={styles['account-stats']}>
            <button className={styles['following-btn']} type="button">
              {account._count.followers} followers
            </button>
            <button className={styles['following-btn']} type="button">
              {account._count.following} following
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
              <div className={styles['posts']}>
                {/* {posts.map((post) => {
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
                })} */}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default ProfilePage;

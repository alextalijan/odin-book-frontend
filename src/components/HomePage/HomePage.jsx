import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import styles from './HomePage.module.css';
import { useContext, useEffect, useState, useRef } from 'react';

function HomePage() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const pageNum = useRef(1);

  // Fetch posts from followings
  useEffect(() => {
    fetch(
      import.meta.env.VITE_API +
        `/users/${user.id}/feed?page=${pageNum.current}`,
      {
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
      .catch((error) => setPostsError(error.message))
      .finally(() => setLoadingPosts(false));
  }, []);

  return (
    <>
      <h1 className={styles.h1}>Feed</h1>
      {loadingPosts ? (
        <div className={styles['loading-wrapper']}>
          <span className={styles['loading-msg']}>Loading posts...</span>
          <img
            src="/public/loading-icon.png"
            alt="loading icon"
            className={styles['loading-icon']}
          />
        </div>
      ) : postsError ? (
        <p className={styles.error}>{postsError}</p>
      ) : posts.length === 0 ? (
        <>
          <p className={styles['no-posts-msg']}>
            No posts yet. Follow more people to see more posts.
          </p>
          <Link to="/search" className={styles['find-people-link']}>
            Find People
          </Link>
        </>
      ) : (
        <div>
          {posts.map((post) => {
            return <Post />;
          })}
        </div>
      )}
    </>
  );
}

export default HomePage;

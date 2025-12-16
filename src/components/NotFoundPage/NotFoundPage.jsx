import styles from './NotFoundPage.module.css';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <>
      <p className={styles.message}>
        <span className={styles.number}>404</span> Page not found.
      </p>
      <Link className={styles.link} to="/">
        Back
      </Link>
    </>
  );
}

export default NotFoundPage;

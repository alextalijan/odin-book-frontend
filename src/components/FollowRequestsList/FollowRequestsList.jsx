import AccountListing from '../AccountListing/AccountListing';
import FollowRequestListing from '../FollowRequestListing/FollowRequestListing';
import styles from './FollowRequestList.module.css';

function FollowRequestList({ requests, refreshList }) {
  return (
    <ul className={styles.list}>
      {requests.map((request) => {
        return (
          <FollowRequestListing
            key={request.id}
            requestId={request.id}
            sender={request.sender}
            refreshList={refreshList}
          />
        );
      })}
    </ul>
  );
}

export default FollowRequestList;

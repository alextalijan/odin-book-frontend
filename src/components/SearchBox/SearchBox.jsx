import styles from './SearchBox.module.css';
import { useState } from 'react';
import AccountListing from '../AccountListing/AccountListing';
import UnfollowModal from '../UnfollowModal/UnfollowModal';
import CancelRequestModal from '../CancelRequestModal/CancelRequestModal';

function SearchBox({ accounts, refreshSearch }) {
  const [unfollowModal, setUnfollowModal] = useState(false);
  const [cancelRequestModal, setCancelRequestModal] = useState(false);
  const [accountToModify, setAccountToModify] = useState(null);

  return (
    <>
      <ul className={styles.container}>
        {accounts.length === 0 ? (
          <li className={styles['no-accounts-msg']}>No accounts found.</li>
        ) : (
          accounts.map((account) => {
            return (
              <AccountListing
                account={account}
                openUnfollowModal={() => setUnfollowModal(true)}
                openCancelRequestModal={() => setCancelRequestModal(true)}
                accountToModify={() => setAccountToModify(account)}
                refreshSearch={refreshSearch}
              />
            );
          })
        )}
      </ul>
      {unfollowModal && (
        <UnfollowModal
          accountToUnfollow={accountToModify}
          clearAccountToUnfollow={() => setAccountToModify(null)}
          refreshSearch={refreshSearch}
          closeModal={() => setUnfollowModal(false)}
        />
      )}
      {cancelRequestModal && (
        <CancelRequestModal
          accountToCancel={accountToModify}
          clearAccountToCancel={() => setAccountToModify(null)}
          refreshSearch={refreshSearch}
          closeModal={() => setCancelRequestModal(false)}
        />
      )}
    </>
  );
}

export default SearchBox;

// Function that sends a follow request to the server
function sendFollowRequest(accountId, refresh) {
  fetch(import.meta.env.VITE_API + `/users/${accountId}/follow-requests`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((json) => {
      if (!json.success) {
        return alert(json.message);
      }

      refresh();
    });
}

export default sendFollowRequest;

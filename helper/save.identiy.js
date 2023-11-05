const { admin } = require("./firestore.initilizer");

// I think this one is pretty straightforward.
const saveIdentityData = async (
  userRef,
  authResponse,
  accessToken,
  identityResponse
) => {
  try {
    // Find the identity information for the specific account within identityResponse.
    const identity = identityResponse.accounts.find(
      (account) => account.account_id === authResponse.accounts[0].account_id
    );

    if (identity) {
      // Set the data in the Firestore document.
      userRef.set(
        {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          account_id: identity.account_id,
          name: identity.owners[0].names,
          emails: identity.owners[0].emails,
          accessToken: accessToken,
        },
        { merge: true }
      );
    }
  } catch (error) {
    throw error;
  }
};

module.exports = saveIdentityData;

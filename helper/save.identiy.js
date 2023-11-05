const { admin } = require("./firestore.initilizer");

const saveIdentityData = async (
  userRef,
  authResponse,
  accessToken,
  identityResponse
) => {
  const identity = identityResponse.accounts.find(
    (account) => account.account_id === authResponse.accounts[0].account_id
  );

  if (identity) {
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
};

module.exports = saveIdentityData;

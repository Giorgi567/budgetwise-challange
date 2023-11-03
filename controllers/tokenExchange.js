const plaidClient = require("../helper/plaid.client.setup");
const { admin, firestore } = require("../helper/firestore.initilizer"); // Adjust the path as needed
const User = require("../modules/users.module");

exports.tokenExchange = async (req, res, next) => {
  const { publicToken } = req.body;
  const { access_token: accessToken } = await plaidClient.exchangePublicToken(
    publicToken
  );

  const start_date = "2023-10-01";
  const end_date = "2023-11-01";

  const authResponse = await plaidClient.getAuth(accessToken);
  const identityResponse = await plaidClient.getIdentity(accessToken);
  const balanceResponse = await plaidClient.getBalance(accessToken);
  const transactionResponse = await plaidClient.getTransactions(
    accessToken,
    start_date,
    end_date
  );
  console.log(transactionResponse);

  // Loop through the users in authResponse and handle their data separately
  for (const user of authResponse.accounts) {
    // Create a unique document reference for each user using their account_id
    const userRef = User.doc(user.account_id);

    // Saves account balances into Firestore
    const account = balanceResponse.accounts.find(
      (account) => account.account_id === user.account_id
    );
    if (account) {
      const accountBalances = {
        account_id: account.account_id,
        available: account.balances.available,
        current: account.balances.current,
        iso_currency_code: account.balances.iso_currency_code,
      };

      // Saves account balances to a subcollection 'accountBalances'
      userRef.collection("accountBalances").add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        balances: accountBalances,
      });
    }

    // Saves identity data directly to the user's document
    const identity = identityResponse.accounts.find(
      (account) => account.account_id === user.account_id
    );
    if (identity) {
      // Set the identity data directly in the user's document
      userRef.set(
        {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          account_id: identity.account_id,
          name: identity.owners[0].names,
          emails: identity.owners[0].emails,
          accessToken: accessToken,
        },
        { merge: true } // This merge option ensures that new identity data is merged with existing data
      );
    }

    // Example: Save transactions as a subcollection 'transactions' under the user's document
    const userTransactions = transactionResponse.accounts.filter(
      (transaction) => transaction.account_id === user.account_id
    );
    userTransactions.forEach((transaction) => {
      userRef.collection("transactions").add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        data: transaction,
      });
    });
  }

  res.sendStatus(200);
};

exports.getAuthResponseFunction = async (req, res, next) => {
  try {
    const { publicToken } = req.query; // Assuming publicToken is passed as a query parameter
    const { access_token: accessToken } = await plaidClient.exchangePublicToken(
      publicToken
    );
    const authResponse = await plaidClient.getAuth(accessToken);
    res.status(200).json(authResponse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching authResponse." });
  }
};

// Function to fetch identityResponse
exports.getIdentityResponseFunction = async (req, res, next) => {
  try {
    const { publicToken } = req.query; // Assuming publicToken is passed as a query parameter
    const { access_token: accessToken } = await plaidClient.exchangePublicToken(
      publicToken
    );
    const identityResponse = await plaidClient.getIdentity(accessToken);
    res.status(200).json(identityResponse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching identityResponse." });
  }
};

// Function to fetch balanceResponse
exports.getBalanceResponseFunction = async (req, res, next) => {
  try {
    const { publicToken } = req.query; // Assuming publicToken is passed as a query parameter
    const { access_token: accessToken } = await plaidClient.exchangePublicToken(
      publicToken
    );
    const balanceResponse = await plaidClient.getBalance(accessToken);
    res.status(200).json(balanceResponse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching balanceResponse." });
  }
};

const plaidClient = require("../helper/plaid.client.setup");
const { admin, firestore } = require("../helper/firestore.initilizer"); // Adjust the path as needed
const User = require("../modules/users.module");

exports.tokenExchange = async (req, res, next) => {
  const { publicToken } = req.body;
  const { access_token: accessToken } = await plaidClient.exchangePublicToken(
    publicToken
  );

  // These are hard-coded because in the test (sandbox) environment, you can only get transactions as old as 2 years, no more than that
  const start_date = "2021-11-01";
  const end_date = "2023-10-01";

  const authResponse = await plaidClient.getAuth(accessToken);
  const identityResponse = await plaidClient.getIdentity(accessToken);
  const balanceResponse = await plaidClient.getBalance(accessToken);
  const transactionResponse = await plaidClient.getTransactions(
    accessToken,
    start_date,
    end_date
  );

  const userRef = await User.doc(authResponse.accounts[0].account_id);
  console.log("ACCOUTNS", balanceResponse.accounts);
  const [checkingAccount, savingsAccount] = balanceResponse.accounts;

  // Save identity data directly to the user's document
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

  // Create a unique document reference with Firestore-generated ID for each user account
  const userAccountRef = userRef
    .collection("Accounts")
    .doc(authResponse.accounts[0].account_id);

  // Create subcollections for balance and transaction history
  const checkingRef = userAccountRef.collection("Checking");
  const savingRef = userAccountRef.collection("Saving");

  // Save account balances into Firestore
  const account = balanceResponse.accounts.find(
    (account) => account.account_id === authResponse.accounts[0].account_id
  );
  if (account) {
    checkingRef.add(checkingAccount);

    savingRef.add(savingsAccount);
  }

  // Save transactions as documents in the transaction history subcollection
  const userTransactions = transactionResponse.transactions.filter(
    (transaction) =>
      transaction.account_id === authResponse.accounts[0].account_id
  );

  userTransactions.forEach((transaction) => {
    const transactionRef = userAccountRef.collection("TransactionHistory");
    transactionRef.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      data: transaction,
    });
  });

  return res.sendStatus(200);
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

const plaidClient = require("../helper/plaid.client.setup");
const User = require("../modules/users.module");
const saveBalances = require("../helper/save.balance");
const saveIdentityData = require("../helper/save.identiy");
const saveTransactions = require("../helper/save.transactions");

exports.tokenExchange = async (req, res, next) => {
  const { publicToken } = req.body;
  const { access_token: accessToken } = await plaidClient.exchangePublicToken(
    publicToken
  );

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
  console.log("ACCOUNTS", balanceResponse.accounts);

  await saveIdentityData(userRef, authResponse, accessToken, identityResponse);
  const userAccountRef = userRef
    .collection("Accounts")
    .doc(authResponse.accounts[0].account_id);

  await saveBalances(userAccountRef, authResponse, balanceResponse);
  await saveTransactions(userAccountRef, authResponse, transactionResponse);

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

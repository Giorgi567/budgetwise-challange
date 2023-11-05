const plaidClient = require("../helper/plaid.client.setup");
const User = require("../modules/users.module");
const saveBalances = require("../helper/save.balance");
const saveIdentityData = require("../helper/save.identiy");
const saveTransactions = require("../helper/save.transactions");

exports.tokenExchange = async (req, res, next) => {
  try {
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
    // creating a reference to a  document
    const userRef = await User.doc(authResponse.accounts[0].account_id);

    await saveIdentityData(
      userRef,
      authResponse,
      accessToken,
      identityResponse
    );
    await saveBalances(userRef, authResponse, balanceResponse);
    await saveTransactions(authResponse, transactionResponse);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

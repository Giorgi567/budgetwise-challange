const Transactions = require("../modules/transactions.module");
const { admin } = require("./firestore.initilizer");
const saveTransactions = async (
  userAccountRef,
  authResponse,
  transactionResponse
) => {
  const userTransactions = transactionResponse.transactions.filter(
    (transaction) =>
      transaction.account_id === authResponse.accounts[0].account_id
  );

  userTransactions.forEach((transaction) => {
    Transactions.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      transaction,
    });
  });
};

module.exports = saveTransactions;

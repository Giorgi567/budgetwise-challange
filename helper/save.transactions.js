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
    const transactionRef = userAccountRef.collection("TransactionHistory");
    transactionRef.add({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      data: transaction,
    });
  });
};

module.exports = saveTransactions;

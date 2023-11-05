const Transactions = require("../modules/transactions.module");
const { admin } = require("./firestore.initilizer");

const saveTransactions = async (authResponse, transactionResponse) => {
  try {
    // Filter user transactions based on their account_id
    const userTransactions = transactionResponse.transactions.filter(
      (transaction) =>
        transaction.account_id === authResponse.accounts[0].account_id
    );

    // Iterate through user transactions and add them to the Firestore collection
    userTransactions.forEach((transaction) => {
      Transactions.add({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        transaction,
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = saveTransactions;

const Transactions = require("../modules/transactions.module");
const User = require("../modules/users.module");
const admin = require("firebase-admin");

exports.calcMonthlyBudget = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    // Reference to Firestore collection "TransactionHistory"
    const transactionHistoryCollection = admin
      .firestore()
      .collection("transactionHistory");

    // Querys transactions where account_id matches userId
    const query = transactionHistoryCollection.where(
      "transaction.account_id",
      "==",
      userId
    );

    // gets snpashot of query
    const snapshot = await query.get();

    // Initialize an array to store matching transactions
    const matchingTransactions = [];

    snapshot.forEach((doc) => {
      // Get data from each document
      const transactionData = doc.data();

      // Push matching transactions to the array after taking the absolute value of the amount
      matchingTransactions.push(Math.abs(transactionData.transaction.amount));
    });

    //this sums up all the the expenses
    const totalTransactionExpense = matchingTransactions.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    res.status(200).json({
      total_transaction_expenses: totalTransactionExpense,
      matchingTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("An error occurred while fetching transactions.");
  }
};

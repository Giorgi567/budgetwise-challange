const Transactions = require("../modules/transactions.module");
const User = require("../modules/users.module");

exports.getUsersTransactions = async (req, res, next) => {
  const userId = req.params.userId;

  //querys the entire Transactions Collection
  const query = Transactions.where("transaction.account_id", "==", userId);

  // gets snpashot of query
  const snapshot = await query.get();

  // Initialize an array to store matching transactions
  const matchingTransactions = [];

  snapshot.forEach((doc) => {
    // Get data from each document
    const transactionData = doc.data();

    // Push matching transactions to the array after taking the absolute value of the amount
    matchingTransactions.push(transactionData.transaction);
  });

  //this sums up all the the expenses which is incurred as a negative numbers. why? well beacause its expenses you spend money on sometin from your bank account.

  res.status(200).json({
    status: "success",
    monthly_transactoins: matchingTransactions,
  });
};

const Transactions = require("../modules/transactions.module");
const User = require("../modules/users.module");
const admin = require("firebase-admin");

exports.calcMonthlyBudget = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const now = new Date(); // Get the current date

    // Create a new Date object based on the current date, then subtract 12 months. i did 12 months because it was not querying for 1 or even 10 months least i could go was 12 months.
    const monthsAgo = new Date(now);
    monthsAgo.setMonth(monthsAgo.getMonth() - 12);

    // Extract the year, month, and day components from the "monthsAgo" date.
    const year = monthsAgo.getFullYear(); // Get the year.
    const month = monthsAgo.getMonth() + 1; // Get the month
    const day = monthsAgo.getDate(); // Get the day of the month.

    // Create a formatted date string in the "YYYY/MM/DD" format.
    const formattedDate = `${year}/${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}`;

    //querys the entire Transactions Collection
    const query = Transactions.where(
      "transaction.account_id",
      "==",
      userId
    ).where("transaction.date", ">=", formattedDate);

    // gets snpashot of query
    const snapshot = await query.get();

    // Initialize an array to store matching transactions
    const matchingTransactions = [];

    snapshot.forEach((doc) => {
      // Get data from each document
      const transactionData = doc.data();

      // Push matching transactions to the array after taking the absolute value of the amount
      matchingTransactions.push(transactionData.transaction.amount);
    });

    //this sums up all the the expenses which is incurred as a negative numbers. why? well beacause its expenses you spend money on sometin from your bank account.
    const totalTransactionExpense = matchingTransactions.reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    //////////////// Code Below Gets Savings and Checkings Balance ///////////////////////////
    const savings = [];
    const savingsQuery = User.doc(userId).collection("SavingAccount");
    const savingsSnapshot = await savingsQuery.get();

    savingsSnapshot.forEach((doc) => {
      // Get data from each document
      const savingsData = doc.data();

      // Push matching transactions to the array after taking the absolute value of the amount
      savings.push(savingsData.balances.current);
    });

    // Code to fetch Checking Account data
    const checking = [];

    const checkingQuery = User.doc(userId).collection("CheckingAccount");
    const checkingSnapshot = await checkingQuery.get();

    checkingSnapshot.forEach((doc) => {
      // Get data from each document
      const checkingData = doc.data();

      // Push matching transactions to the array after taking the absolute value of the amount
      checking.push(checkingData.balances.current);
    });

    // i hard coded [0] here because in savings/checking account a user only gonna have only 1 field where its go
    // LITLE WARNING: Monthly income in results may be 1$ lower becuz i used Math.celi()
    const monthlyIncome =
      Math.ceil(Math.abs(totalTransactionExpense)) + savings[0] + checking[0];

    const monthlyExpensesNeeds = monthlyIncome * 0.5; // 50% of monthly income for needs

    const monthlyBudgetNeeds = Math.ceil(monthlyExpensesNeeds);
    const monthlyBudgetWants = Math.ceil(monthlyIncome * 0.3); // 30% for wants
    const monthlyBudgetSavings = Math.ceil(monthlyIncome * 0.2); //20% for savings

    res.status(200).json({
      your_monthly_budget: {
        monthlyIncome: monthlyIncome,
        needs: monthlyBudgetNeeds,
        wants: monthlyBudgetWants,
        savings: monthlyBudgetSavings,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("An error occurred while fetching transactions.");
  }
};

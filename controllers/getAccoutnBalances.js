const User = require("../modules/users.module");

exports.getAccountBalances = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const savingsBalances = [];
    const savingsQuery = User.doc(userId).collection("SavingAccount");
    const savingsSnapshot = await savingsQuery.get();

    savingsSnapshot.forEach((doc) => {
      // Get data from each document
      const savingsData = doc.data();

      // Push savings balances to the array
      savingsBalances.push(savingsData.balances.current);
    });

    // Code to fetch Checking Account data
    const checkingBalances = [];

    const checkingQuery = User.doc(userId).collection("CheckingAccount");
    const checkingSnapshot = await checkingQuery.get();

    checkingSnapshot.forEach((doc) => {
      // Get data from each document
      const checkingData = doc.data();

      // Push checking balances to the array
      checkingBalances.push(checkingData.balances.current);
    });

    res
      .status(200)
      .json({
        status: "success",
        SavingsAccountBalance: savingsBalances[0],
        CheckingAccoutBalance: checkingBalances[0],
      });
  } catch (error) {
    // Handle any errors here
    console.error("Error fetching account balances:", error);
    res.status(500).send("An error occurred while fetching account balances.");
  }
};

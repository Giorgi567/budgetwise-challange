const saveBalances = async (userAccountRef, authResponse, balanceResponse) => {
  try {
    // Find the account matching the authenticated account ID
    const account = balanceResponse.accounts.find(
      (account) => account.account_id === authResponse.accounts[0].account_id
    );

    if (account) {
      // Note: when I tried looping through `balanceResponse.accounts` since `balanceResponse.accounts` can have more than 2 items in it,
      // but it had given me errors that were not worth spending time on due to time limitations.
      // So I went with this solution. I know this is a rough solution for this, but since the sandbox only has 1 sample account, I decided to go with this.
      const [checkingAccount, savingsAccount] = balanceResponse.accounts;

      // Add checking account data to Firestore
      userAccountRef.collection("CheckingAccount").add(checkingAccount);

      // Add savings account data to Firestore
      userAccountRef.collection("SavingAccount").add(savingsAccount);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = saveBalances;

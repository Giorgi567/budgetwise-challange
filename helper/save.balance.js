const saveBalances = async (userAccountRef, authResponse, balanceResponse) => {
  const account = balanceResponse.accounts.find(
    (account) => account.account_id === authResponse.accounts[0].account_id
  );

  if (account) {
    const [checkingAccount, savingsAccount] = balanceResponse.accounts;
    userAccountRef.collection("CheckingAccount").add(checkingAccount);
    userAccountRef.collection("SavingAccount").add(savingsAccount);
  }
};

module.exports = saveBalances;

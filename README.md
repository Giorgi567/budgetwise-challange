# BudgetWise Challange

## Local Development

```
Start app and navigate to `localhost:3000`:
Or whatever port you running on.
Note: account: email: user_good password: pass_good.
```

$ npm install

```
npm start
```

```
CLIENT_ID = 'INSERT_CLIENT_ID'
SECRET = 'INSERT_SECRET'

It's recommended to use your own Plaid credentials. The provided credentials may not always be available.

```

```
Note: Since there was no mention of security in this challenge, I did not allocate any significant time to address security concerns. If you have any reservations about my skills in security and data protection, I encourage you to explore my other projects, such as the eCommerce API, and many more.

DATABASE DESIGN:

1. User can have 2 or more accounts, so the hierarchy goes like this:

   - User
     - Accounts (Savings Account, Checking Account, etc...)
       - Each of the accounts has its own balance.

2. **transactionHistory** is not an account, so it's not listed in the hierarchy.

**DETAILS:**

- There are 2 Top-Level Collections:

  1.  **transactionHistory:**

      - This collection saves all the transactions.
      - Each transaction document includes fields for `timestamp` and the `transaction` object.
      - You can explore the transaction details by opening the `transaction` object.

  2.  **Users:**
      - The Users collection contains user documents.
      - Each user document stores general user information, such as an array of emails (typically 3), including a primary email for account recovery, `account_id` from Plaid, `accessToken` from Plaid, and the user's name.

  - Within the user document, there are 2 sub-collections:

    1. **CheckingAccount:**

       - This sub-collection holds checking account balance information.

    2. **SavingAccount:**
       - This sub-collection contains savings account balance details.

- Everything within the database is assigned unique IDs.
```

const plaid = require("plaid");

//Creates a new Plaid Client instance with given credentials in .env file
const plaidClient = new plaid.Client({
  clientID: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  env: plaid.environments.sandbox,
});

module.exports = plaidClient;

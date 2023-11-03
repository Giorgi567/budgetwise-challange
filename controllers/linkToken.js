const plaidClient = require("../helper/plaid.client.setup");

exports.createLinkToken = async (req, res, next) => {
  const { link_token: linkToken } = await plaidClient.createLinkToken({
    user: {
      client_user_id: "uid",
    },
    client_name: "budgetWise",
    products: ["auth", "identity", "transactions"],
    country_codes: ["US"],
    language: "en",
  });

  res.json({ linkToken });
};

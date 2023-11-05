const plaidClient = require("../helper/plaid.client.setup");

// This function is pretty straightforward. It creates a link token
// according to given property values.
exports.createLinkToken = async (req, res, next) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

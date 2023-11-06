require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const errorHandler = require("./middleware/error-handler");

/////////////////////// PARSERS ////////////////////////////
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

/////////////////////// ROUTERS ////////////////////////
const accesKeyRoutes = require("./routes/getAccesKey.routes");
const tokenExchangeRoutes = require("./routes/tokenExchange.routes");
const createLinkRoutes = require("./routes/createLink.routes");
const monthylBudgetRoutes = require("./routes/monthly.budget.routes");
const monthlyTransactionRoutes = require("./routes/getMonthlyTransaction.routes");
const getAccountBalancesRoutes = require("./routes/Account.Balances.routes");
/////////////////////// REQUEST HANDLERS ///////////////////

//directes you to palid's client-side.
// WARNING: READ README.md for more
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/create-link-token", createLinkRoutes);
app.use("/token-exchange", tokenExchangeRoutes);
app.use("/getAccessKey", accesKeyRoutes);
app.use("/usersMonthlyBudget", monthylBudgetRoutes);
app.use("/getUsersTransactions", monthlyTransactionRoutes);
app.use("/getAccountBalances", getAccountBalancesRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

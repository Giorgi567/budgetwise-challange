const { admin, firestore } = require("../helper/firestore.initilizer");

const db = admin.firestore();

//Creates a firestore top level collection named "transactionHistory"
const Transactions = db.collection("transactionHistory");

module.exports = Transactions;

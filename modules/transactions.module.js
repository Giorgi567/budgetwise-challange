const { admin, firestore } = require("../helper/firestore.initilizer");

const db = admin.firestore();

const Transactions = db.collection("transactionHistory");

module.exports = Transactions;

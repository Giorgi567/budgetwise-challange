const { admin, firestore } = require("../helper/firestore.initilizer");
const User = require("./users.module");
const db = admin.firestore();

const PlaidItem = User.doc().collection("pla");

module.exports = User;

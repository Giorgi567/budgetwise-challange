const { admin, firestore } = require("../helper/firestore.initilizer");

const db = admin.firestore();

const User = db.collection("Users");

module.exports = User;

const { admin, firestore } = require("../helper/firestore.initilizer");

const db = admin.firestore();

//Creates a firestore top level collection named "Users"
const User = db.collection("Users");

module.exports = User;

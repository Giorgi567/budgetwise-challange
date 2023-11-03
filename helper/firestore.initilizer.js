const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.package.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();

module.exports = {
  admin,
  firestore,
};

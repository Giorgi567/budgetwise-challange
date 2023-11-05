const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.package.json");

// Initializes the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Creates a Firestore instance using the initialized Firebase Admin SDK
const firestore = admin.firestore();

module.exports = {
  admin,
  firestore,
};

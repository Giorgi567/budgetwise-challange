const User = require("../modules/users.module");

exports.getAccessKey = async (req, res, next) => {
  try {
    console.log(req.params.userId);

    const userDocRef = User.doc(req.params.userId);
    userDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          console.log("User found:");
          res.status(200).json({ access_token: userData.accessToken });
        } else {
          console.log("No such document!");
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        console.error("Error getting user document:", error);
        res.status(500).json({ message: "Error getting user document" });
      });
  } catch (error) {
    console.error("Error searching for user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while searching for the user." });
  }
};

const User = require("../modules/users.module");
exports.getAccessKey = async (req, res, next) => {
  try {
    //Create a reference to the User's document by the given userId.
    const userDocRef = User.doc(req.params.userId);
    userDocRef
      .get() // gets documents snapshot
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data(); // gets data from documents snapshot
          res.status(200).json({ access_token: userData.accessToken });
        } else {
          return next(new CaptureError("User not found", 404));
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

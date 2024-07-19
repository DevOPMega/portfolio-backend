const { getDoc, doc, updateDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");

// Controller for accessing firestore database
class FirebaseFirestoreController {
  // Get user profile using user uid from user token
  async getUserUsingUid(req, res) {
    const userUID = req.user.uid;
    const docRef = doc(db, "users", userUID);
    const user = await getDoc(docRef);
    if (user) {
      const userInfo = user.data();
      return res.status(200).json({
        email: userInfo.email,
        name: userInfo.name,
        phoneNo: userInfo.phoneNo,
      });
    }
    res.status(404).json({
      error: "User not found",
    });
  }
  // Update user profile using user uid from user token
  async updateUserProfile(req, res) {
    const updateUserProfileObj = req.body;
    const userUID = req.user.uid;
    const docRef = doc(db, "users", userUID);
    try {
      await updateDoc(docRef, updateUserProfileObj);
      return res.status(202).json({
        message: "User Profile Updated Successfully",
      });
    } catch (e) {
      res.status(304).json({
        error: e.message,
      });
    }
  }
}

module.exports = new FirebaseFirestoreController();

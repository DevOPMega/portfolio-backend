const { getDoc, doc } = require("firebase/firestore");
const { db } = require("../config/firebase");

class FirebaseFirestoreController {
    async getUserUsingUid(req, res) {
        const userUID = req.user.uid;
        const docRef = doc(db, "users", userUID);
        const user = await getDoc(docRef);
        if (user) {
            const userInfo = user.data();
            return res.status(200).json({
                email: userInfo.email,
                name: userInfo.name,
                phoneNo: userInfo.phoneNo
            })
        } 
        res.status(404).json({
            error: "User not found"
        })
    }
}

module.exports = new FirebaseFirestoreController();
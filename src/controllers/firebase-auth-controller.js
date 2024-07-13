const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail
} = require("../config/firebase");

const auth = getAuth();

class FirebaseAuthController {
    // Register new user
    registerUser(req, res) {
        const {
            email,
            password
        } = req.body;
        console.log(req.body);
        if ( !email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        res.status(201).json({
                            message: "Verification email sent! User created successfully!"
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).json({
                            error: "Error sending email verification"
                        })
                    })
            })
            .catch((error) => {
                const errorMessage = error.message || "An error occured whiler registering user";
                res.status(500).json({error: errorMessage});
            });
    }
    // Login user 
    loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                email: "Email is required",
                password: "Password is required",
            });
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User access token
                const idToken = userCredential._tokenResponse.idToken;
                if (idToken) {
                    // Set token in cookies
                    res.cookie('access_token', idToken, {
                        // domain: "http://localhost:3000",
                        // httpOnly: true
                    });
                    res.status(200).json({
                        message: "User logged in successfully", 
                        userCredential
                    });
                } else {
                    // If token not created 
                    res.status(500).json({
                        error: "Internal Server Error"
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                const errorMessage = error.message || "An error occured while logging in";
                res.status(500).json({
                    error: errorMessage
                });
            })
    }
    logoutUser(req, res) {
        signOut(auth) 
            .then(() => {
                res.clearCookie('access_token');
                res.status(200).json({
                    message: "User logged out successfully"
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({
                    error: "Internal Server Error"
                });
            })
    }
    // Reset Password 
    resetPassword(req, res) {
        const { email } = req.body;
        if (!email ) {
            return res.status(422).json({
              email: "Email is required"
            });
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                res.status(200).json({
                    message: "Password reset email sent successfully!"
                });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({
                    error: "Internal Server Error"
                })
            });
    }

}

module.exports = new FirebaseAuthController();
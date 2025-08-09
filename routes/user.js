const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const ExpressError = require("../utils/ExpressError.js");
const { userSchema } = require("../schema.js");
const userController = require("../controllers/user.js");

router
    .route("/signup")
    .get( userController.renderSignUpForm)// User registration route (get request) user ki info leli
    .post( wrapAsync(userController.signupUser)); // User registration route (post request) user DB me store hoga
 
router
    .route("/login")  
    .get( userController.renderLoginForm) // User login route (get request) user ko login page dikhayega  
    .post( passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.loginUser); // User login route (post request) user ko authenticate karega

// User logout route
router.get("/logout", userController.logoutUser); // Using the controller to handle user logout

module.exports = router; // Exporting the router to be used in the main application file
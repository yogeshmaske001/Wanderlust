const User = require("../models/user.js");

module.exports.renderSignUpForm =  (req, res) => {//
  res.render("users/signup.ejs", { title: "signup" });// Rendering the signup page
};

module.exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;// Extracting username, email, and password from the request body
        const user = new User({ username, email });// Creating a new User instance with the provided username and email
        const registeredUser = await User.register(user, password);  // Registering the user with the provided password
        console.log(registeredUser);
        req.login(registeredUser, (err) => { // Logging in the user after registration
            if (err) {
                return next(err); // Handling any errors during login
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
  
    } catch (error) {
        req.flash("error", error.message); // Flashing the error message
        res.redirect("/signup"); // Redirecting to the signup page on error
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs", { title: "login" });
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings"); // Redirecting to the listings page after successful login
};

module.exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/listings"); // Redirecting to the listings page after logout
    });
};
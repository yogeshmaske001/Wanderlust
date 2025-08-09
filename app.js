if(process.env.NODE_ENV !== "production") {// This line checks if the environment is not production, and if so, it loads environment
  require("dotenv").config();// This line loads environment variables from a .env file into process.env
}
const express = require("express");
const app=express();
const mongoose =require("mongoose");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js"); 
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // This is used to store session data in MongoDB
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;//It enables local authentication for your app using Passport.js.
const MONGO_URL  = process.env.ATLASDB_URL || "mongodb://localhost:27017/wanderlust"; // Use the environment variable or fallback to local MongoDB
 
main()
.then(()=>{
  console.log("connected to DB");
})
.catch((err)=>{
  console.log(err);
});

async function main(){
  await mongoose.connect(MONGO_URL);
}

app.set("view engine ","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// Session configuration
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600, // time period in seconds after which the session will be updated
  crypto: {
    secret: process.env.SECRET // This should be a strong secret key
  }
});
store.on("error", function(e) {
  console.log("Session Store Error", e);
});

const sessionOptions = {
  store: store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: false, // Set to true if using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24*3 // 3 day
  }
};

app.use(session(sessionOptions));
app.use(flash()); //enables the connect-flash middleware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// This will use the authenticate method provided by passport-local-mongoose
passport.serializeUser(User.serializeUser());// This will serialize the user into the session
passport.deserializeUser(User.deserializeUser());// This will deserialize the user from the session

// Middleware to set flash messages in res.locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make the current user available in all templates
  next();
});
 
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Error Handler
app.all("*", (req, res, next) => {
  throw new ExpressError("Page Not Found", 404);
});

// to handle server side errors
app.use((err, req, res, next) => {
  let { message="something went wrong" , statusCode=500 } = err;
  res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, ()=>{
  console.log("server is listening on port 8080");
});
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const passportLocalMongoose = require("passport-local-mongoose");// username & password will automatically be added

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    listings: [{
        type: Schema.Types.ObjectId,
        ref: "Listing",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
});

userSchema.plugin(passportLocalMongoose);// This will add username and password fields, and handle hashing,salting,authenticate the password

const User = mongoose.model("User", userSchema);
module.exports = User;

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Seting the auther to the review
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "Successfully added a new review!");
    res.redirect(`/listings/${listing._id}`)
};

module.exports.deleteReview = async (req,res)=>{
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/listings/${id}`);
}
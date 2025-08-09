const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
const allListings =await Listing.find({});
res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const url = req.file.path; // Get the file path from multer
    const filename = req.file.filename; // Get the file name from multer
    console.log(url, filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    newListing.image = { url, filename }; // Set the image field with the file path and name
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
}; 

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate([
            {
                path: "reviews",
                options: { limit: 10, sort: { createdAt: -1 } }, // limit to 10 most recent reviews
                select: "rating comment author createdAt", // select only necessary fields
                populate: { path: "author", select: "username" } // select only username from author
            },
            {
                path: "owner",
                select: "username email"
            }
        ]);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250"); // Ensure the original image URL is formatted correctly
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== 'undefined') {
        let url = req.file.path; // Get the file path from multer
        let filename = req.file.filename; // Get the file name from multer
        listing.image = { url, filename }; // Update the image field with the new file path and name
        await listing.save();
    }
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
  let {id}=req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  console.log("you deleted",deleteListing);
  res.redirect("/listings")
}
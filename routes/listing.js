const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({storage: storage});

//Home Route
// router.get("/",  listingsController.home);

router
    .route("/")
    .get( wrapAsync(listingsController.index))//Index Route(get)
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingsController.createListing));//Create Route(post)
      
//New Route(get)
router.get("/new", isLoggedIn, listingsController.renderNewForm);

//Edit Route(get)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));

router
    .route("/:id")  
    .get( wrapAsync(listingsController.showListing))//Show Route(get)
    .put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing))//Update Route(put)
    .delete (isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing));//Delete Route(delete)

module.exports = router;
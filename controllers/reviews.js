const campground = require("../models/campground");
const Campground = require("../models/campground");
const Review = require("../models/review");

//creating review
module.exports.createReview = async (req, res) => {
  //find relevant campground
  const campground = await Campground.findById(req.params.id).populate(
    "reviews"
  );
  //create new Review with info sned by user
  const review = new Review(req.body.review);
  //add user id to the review
  review.author = req.user._id;
  //push review to campgrounds reviews array
  campground.reviews.push(review);
  //calculate and update average rating
  campground.rating = calculateAverage(campground.reviews);
  //save review and campground
  await review.save();
  await campground.save();
  //flash msg
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${campground._id}`);
};

//deleting review
module.exports.deleteReview = async (req, res) => {
  //find by id and pull/delete reveiw from campground reviews array
  await Campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  // delete from reviews database
  await Review.findByIdAndDelete(req.params.reviewId);
  //recalculating and updating average rating
  const campground = await Campground.findById(req.params.id).populate(
    "reviews"
  );
  campground.rating = calculateAverage(campground.reviews);
  //save
  await campground.save();
  //flash msg
  req.flash("success", "Successfully deleted review");
  res.redirect(`/campgrounds/${req.params.id}`);
};

function calculateAverage(reviews) {
  if (reviews.length === 0) {
    return 0;
  }
  let sum = 0;
  reviews.forEach(function (element) {
    sum += element.rating;
  });
  let result = sum / reviews.length;
  return result.toFixed(2); //round to 2 decimal places
}

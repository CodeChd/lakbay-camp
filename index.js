const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Reviews = require("./models/review");
//reusable
const { campgroundSchema, reviewSchema } = require("./schema");

const ErrorAsync = require("./utils/ErrorAsync");

//Custom Error Class
const ExpressError = require("./utils/ExpressError");

const Campground = require("./models/Campground");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/lakbay-camp")
  .then(() => console.log("CONNECTION OPEN!!"))
  .catch((err) => {
    console.log(err, "Oops error");
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "content"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  //serverside validation
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join("");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReviews = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join("");
    console.log(msg);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  ErrorAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    // console.log(campgrounds)
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get(
  "/campgrounds/new",
  ErrorAsync(async (req, res) => {
    res.render("campgrounds/new");
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  ErrorAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

app.get(
  "/campgrounds/:id",
  ErrorAsync(async (req, res) => {
    const { id } = req.params;
    const campID = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground: campID });
  })
);

app.get(
  "/campgrounds/:id/edit",
  ErrorAsync(async (req, res) => {
    const { id } = req.params;
    const campID = await Campground.findById(id);
    res.render("campgrounds/edit", { campground: campID });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  ErrorAsync(async (req, res) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true, runValidators: true }
    );
    res.redirect(`/campgrounds/${updatedCampground.id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  ErrorAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//
app.post(
  "/campgrounds/:id/reviews",
  validateReviews,
  ErrorAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Reviews(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`);

  })
);


//
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  ErrorAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Reviews.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${req.params.id}`);
  })
);

app.use("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oops Something Went Wrong!";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING TO PORT 3000");
});

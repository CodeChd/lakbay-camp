const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

const Campground = require("./models/Campground");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/lakbay-camp")
  .then(() => console.log("CONNECTION OPEN!!"))
  .catch((err) => {
    console.log(err, "Oops error");
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "content"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = await new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground.id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campID = await Campground.findById(id);
  res.render("campgrounds/show", { campground: campID });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campID = await Campground.findById(id);
  res.render("campgrounds/edit", { campground: campID });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const updatedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
  res.redirect(`/campgrounds/${updatedCampground.id}`);
});
 
app.listen(3000, () => {
  console.log("LISTENING TO PORT 3000");
});

const mongoose = require("mongoose");
const { campgroundSchema } = require("../schema");
const Schema = mongoose.Schema;
const Reviews = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

CampgroundSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Reviews.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);

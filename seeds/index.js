const mongoose = require("mongoose");
const Campground = require("../models/Campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/lakbay-camp")
  .then(() => console.log("CONNECTION OPEN!!"))
  .catch((err) => {
    console.log(err, "Oops error");
  });

//   const seedDB = async () => {
//     await Campground.deleteMany({});
//     const c = new Campground({
//         title: 'purple field'
//     })
//     await c.save()
//   }

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[randomNum].city} - ${cities[randomNum].state}`,
      title: `${sample(descriptors)} - ${sample(places)}`
    });
    await camp.save();
  }
};

seedDB();

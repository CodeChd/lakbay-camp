const express = require('express')
const app = express()
const path = require('path')
const Campground = require('./models/Campground')

const mongoose = require('mongoose')

mongoose
  .connect("mongodb://127.0.0.1:27017/lakbay-camp")
  .then(() => console.log("CONNECTION OPEN!!"))
  .catch((err) => {
    console.log(err, "Oops error");
  });



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'content'))

app.get('/' ,(req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({
    title: 'My Backyard',
    description: 'cheap camping',
    location: 'Tanay'
  })
  await camp.save() 
  res.send(camp) 
})

app.listen(3000, () => {
    console.log('LISTENING TO PORT 3000')
})
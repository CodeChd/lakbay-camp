const joi = require("joi");

const pattern = /^[^\d]*$/;

module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required().pattern(pattern).message('Title must only contain string'),
      price: joi.number().required().min(0),
      image: joi.string().required().pattern(pattern).message('Image must only contain string'),
      location: joi.string().required().pattern(pattern).message('Location must only contain string'),
      description: joi.string().required().pattern(pattern).message('Description must only contain string')
    })
    .required(),
});

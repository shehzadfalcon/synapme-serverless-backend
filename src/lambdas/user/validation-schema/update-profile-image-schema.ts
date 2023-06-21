const Joi = require("joi");

export default Joi.object({
  profile_image_url: Joi.string().uri(),
});

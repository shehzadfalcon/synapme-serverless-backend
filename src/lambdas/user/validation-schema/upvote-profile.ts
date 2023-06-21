const Joi = require("joi");

export default Joi.object({
  count: Joi.number().valid(0, 1).required().messages({
    "number.empty": "count must be one of [0, 1]",
    "any.required": "count is a required field",
  }),
});

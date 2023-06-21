const Joi = require("joi");

export default Joi.object({
  neural_id: Joi.string().required().messages({
    "string.empty": "neural_id must contain value",
    "any.required": "neural_id is a required field",
  }),

  user_id: Joi.string().required().messages({
    "string.empty": "user_id must contain value",
    "any.required": "user_id is a required field",
  }),
});

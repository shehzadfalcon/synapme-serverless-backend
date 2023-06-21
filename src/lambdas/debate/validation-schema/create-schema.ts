const Joi = require("joi");

export default Joi.object({
  topic: Joi.string().required().messages({
    "string.empty": "topic must contain value",
    "any.required": "topic is a required field",
  }),
  description: Joi.string().required().messages({
    "string.empty": "description must contain value",
    "any.required": "description is a required field",
  }),
  opponent_id: Joi.string()
    .guid({ version: "uuidv4" })
    .length(36)
    .required()
    .messages({
      "string.empty": "opponent_id must contain value",
      "any.required": "opponent_id is a required field",
    }),
  affirmative: Joi.string().required().messages({
    "string.empty": "affirmative must contain value",
    "any.required": "affirmative is a required field",
  }),
  negative: Joi.string().required().messages({
    "string.empty": "negative must contain value",
    "any.required": "negative is a required field",
  }),
});

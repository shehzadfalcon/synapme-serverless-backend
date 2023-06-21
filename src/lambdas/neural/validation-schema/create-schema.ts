const Joi = require("joi");

export default Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "title must contain value",
    "any.required": "title is a required field",
  }),
  description: Joi.string().required().messages({
    "string.empty": "description must contain value",
    "any.required": "description is a required field",
  }),
  leader_id: Joi.string().required().messages({
    "string.empty": "leader_id must contain value",
    "any.required": "leader_id is a required field",
  }),
});

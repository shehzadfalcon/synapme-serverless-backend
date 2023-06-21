const Joi = require("joi");

export default Joi.object({
  decision: Joi.string().valid("accepted", "rejected").required().messages({
    "string.empty": "decision must contain value",
    "any.required": "decision is a required field",
  }),
  neural_requests_id: Joi.string().required().messages({
    "string.empty": "neural_requests_id must contain value",
    "any.required": "neural_requests_id is a required field",
  }),
});

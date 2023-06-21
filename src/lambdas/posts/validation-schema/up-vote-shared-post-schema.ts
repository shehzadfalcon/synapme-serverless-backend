import Joi from "joi";

export default Joi.object({
  sharedPostId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "sharedPostId must contain value",
      "any.required": "sharedPostId is a required field",
    }),
  userId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "userId must contain value",
      "any.required": "userId is a required field",
    }),
  createdAt: Joi.date().required().messages({
    "string.pattern.name": "{{#name}}",
    "string.empty": "createdAt must contain value",
    "any.required": "createdAt is a required field",
  }),
  receiverId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "receiverId must contain value",
      "any.required": "receiverId is a required field",
    }),
  payload: Joi.object().required().messages({
    "any.empty": " payload must contain value",
    "any.required": " payload is a required field",
  }),
});

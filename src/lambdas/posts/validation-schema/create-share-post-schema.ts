import Joi from "joi";

export default Joi.object({
  postId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "postId must contain value",
      "any.required": "postId is a required field",
    }),
  authorId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "postId must contain value",
      "any.required": "postId is a required field",
    }),
  description: Joi.string()
    .min(4)
    .pattern(
      /^(?=.*\S).+$/,
      "content must include at least one non-space character"
    )
    .required()
    .messages({
      "string.pattern.name": "{{#name}}",
      "string.empty": "content must contain value",
      "any.required": "content is a required field",
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

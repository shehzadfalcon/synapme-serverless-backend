import Joi from "joi";

export default Joi.object({
  authorId: Joi.string()
    .required()
    .guid({ version: "uuidv4" })
    .length(36)
    .messages({
      "string.empty": "authorId must contain value",
      "any.required": "authorId is a required field",
    }),
    content: Joi.string()
    .min(4)
    .pattern(/^(?=.*\S).+$/, "content must include at least one non-space character")
    .required()
    .messages({
      "string.pattern.name": "{{#name}}",
      "string.empty": "content must contain value",
      "any.required": "content is a required field",
    }),
  
    media: Joi.string().empty() // temporary, as the file upload is yet to be applied
});

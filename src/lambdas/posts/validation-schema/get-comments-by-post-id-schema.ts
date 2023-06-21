import Joi from 'joi';

export default Joi.object().keys({
  postId: Joi.string()
  .required()
  .guid({ version: "uuidv4" })
  .length(36)
  .messages({
    "string.empty": "authorId must contain value",
    "any.required": "authorId is a required field",
  }),
});

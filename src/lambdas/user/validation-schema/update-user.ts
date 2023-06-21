const Joi = require("joi");

export default Joi.object({
  first_name: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      "first_name fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed "
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "first_name must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      "string.pattern.name": "{{#name}}",
      "string.base": "first_name must be a type of string",
      "string.empty": "first_name must contain value",
      "any.required": "first_name is a required field",
    }),

  last_name: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      "last_name fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed "
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "last_name must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      "string.pattern.name": "{{#name}}",
      "string.base": "last_name must be a type of string",
      "string.empty": "last_name must contain value",
      "any.required": "last_name is a required field",
    }),

  user_name: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      "user_name fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed "
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "user_name must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      "string.pattern.name": "{{#name}}",
      "string.base": "user_name must be a type of string",
      "string.empty": "user_name must contain value",
      "any.required": "user_name is a required field",
    }),

  date_of_birth: Joi.date().required().messages({
    "string.pattern.name": "{{#name}}",
    "string.empty": "date_of_birth must contain value",
    "any.required": "date_of_birth is a required field",
  }),
  gender: Joi.string().valid("male", "female").required().messages({
    "string.base": "gender must be a type of string",
    "string.required": "gender must be one of [Male, Female]",
  }),

  background: Joi.object({
    stem: Joi.string().empty(""),
    technologyEthicsBeliefs: Joi.string().empty(""),
  }).messages({
    "object.base": "background must be a type of object",
  }),
});

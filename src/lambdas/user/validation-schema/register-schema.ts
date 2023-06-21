const Joi = require('joi');

export default Joi.object({
  email: Joi.string()
    .email()
    .pattern(
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*(\+[a-z0-9-]+)?@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
      { name: 'email' }
    )
    .required()
    .messages({
      'string.empty': 'email must contain value',
      'any.required': 'email is a required field',
      'string.pattern.name': 'email is weak',
    }),

  firstName: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      'Firstname fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed '
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "Firstname must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      'string.pattern.name': '{{#name}}',
      'string.base': 'firstName must be a type of string',
      'string.empty': 'firstName must contain value',
      'any.required': 'firstName is a required field',
    }),

  lastName: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      'Lastname fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed '
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "Lastname must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      'string.pattern.name': '{{#name}}',
      'string.base': 'lastName must be a type of string',
      'string.empty': 'lastName must contain value',
      'any.required': 'lastName is a required field',
    }),

  userName: Joi.string()
    .min(1)
    .max(100)
    .pattern(
      /^[a-zA-Z]/,
      'Username fails to match the required pattern: cannot have special characters in the beginning: numbers are not allowed '
    )
    .pattern(
      /^.{1}[a-zA-Z-.’‘' ]+$/,
      "Username must be all characters: can't have numbers, accented or special characters in your name"
    )
    .required()
    .messages({
      'string.pattern.name': '{{#name}}',
      'string.base': 'username must be a type of string',
      'string.empty': 'username must contain value',
      'any.required': 'username is a required field',
    }),

  password: Joi.string().min(4).required().messages({
    'string.pattern.name': '{{#name}}',
    'string.empty': 'password must contain value',
    'any.required': 'password is a required field',
  }),
  profileImageUrl: Joi.string().uri(),
  dataOfBirth: Joi.date().required().messages({
    'string.pattern.name': '{{#name}}',
    'string.empty': 'dataOfBirth must contain value',
    'any.required': 'dataOfBirth is a required field',
  }),
  gender: Joi.string().valid('male', 'female').required().messages({
    'string.base': 'gender must be a type of string',
    'string.required': 'gender must be one of [Male, Female]',
  }),
  background: Joi.object({
    stem: Joi.string().empty(''),
    technologyEthicsBeliefs: Joi.string().empty(''),
  }),
});

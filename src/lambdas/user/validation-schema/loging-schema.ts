const Joi = require('joi');

export default Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'email must contain value',
    'any.required': 'email is a required field',
  }),

  password: Joi.string().min(4).required().messages({
    'string.pattern.name': '{{#name}}',
    'string.empty': 'password must contain value',
    'any.required': 'password is a required field',
  }),
});

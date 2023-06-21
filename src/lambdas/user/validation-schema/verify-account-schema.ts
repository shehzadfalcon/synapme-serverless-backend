const Joi = require('joi');

export default Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'email must contain value',
    'any.required': 'email is a required field',
  }),

  verificationCode: Joi.string().max(8).required().messages({
    'string.pattern.name': '{{#name}}',
    'string.empty': 'verificationCode must contain value',
    'any.required': 'verificationCode is a required field',
    'string.max':
      'verificationCode is invalid must be upto or equal to 8 characters',
  }),
});

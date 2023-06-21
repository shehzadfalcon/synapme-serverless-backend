const Joi = require('joi');

export default Joi.object({
  code: Joi.string().required().messages({
    'string.empty': 'code must contain value',
    'any.required': 'code is a required field',
  }),

  password: Joi.string().required().messages({
    'string.empty': 'password must contain value',
    'any.required': 'password is a required field',
  }),
});

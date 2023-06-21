const Joi = require('joi');

export default Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'email must contain value',
    'any.required': 'email is a required field',
  }),
});

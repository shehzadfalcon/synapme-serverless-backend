import Joi from 'joi';

export default Joi.object().keys({
  expirationTime: Joi.string().allow(null).required().messages({
    'any.empty': 'expiration time  must contain value',
    'any.required': 'expiration time  is a required field',
  }),
  endpoint: Joi.string().required().messages({
    'any.empty': 'endpoint must contain value',
    'any.required': 'endpoint is a required field',
  }),
  keys: Joi.object({
    p256dh: Joi.string().required().messages({
      'any.empty': 'p256dh must contain value',
      'any.required': 'p256dh is a required field',
    }),
    auth: Joi.string().required().messages({
      'any.empty': 'auth must contain value',
      'any.required': 'auth is a required field',
    }),
  }),
});

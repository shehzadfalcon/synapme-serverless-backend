import Joi from 'joi';

export default Joi.object().keys({
  user_id: Joi.string().required().messages({
    'any.empty': 'user id must contain value',
    'any.required': 'user id  is a required field',
  }),
});

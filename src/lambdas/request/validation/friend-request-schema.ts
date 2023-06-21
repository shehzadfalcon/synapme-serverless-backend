import Joi from 'joi';

export default Joi.object({
  receiverID: Joi.string().required().messages({
    'any.empty': 'receiver id must contain value',
    'any.required': 'receiver id is a required field',
  }),
  payload: Joi.object().required().messages({
    'any.empty': ' payload must contain value',
    'any.required': ' payload is a required field',
  }),
});

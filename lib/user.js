
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);

exports.user = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('[a-zA-Z0-9 \-_.]'))
    .min(3)
    .max(50)
    .required(),

  first_name: Joi.string()
    .min(1)
    .required(),

  last_name: Joi.string()
    .min(1)
    .required(),

  email: Joi.string()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required(),

  password: JoiPassword.string()
    .min(8)
    .max(30)
    .minOfSpecialCharacters(2)
    .minOfLowercase(2)
    .minOfUppercase(2)
    .minOfNumeric(2)
    .required(),

  user_id: Joi.number(),
  group_id: Joi.number(),
})
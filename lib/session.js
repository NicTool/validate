const Joi = require('joi')

const shared = require('./shared')
const group = require('./group')
const user = require('./user')

exports.id = shared.uint32

exports.POST = Joi.object({
  username: user.username.required(),
  password: user.password.required(),
})

exports.GET_res = Joi.object({
  user: user.v3,
  group: group.v3,
  session: Joi.object({
    id: Joi.number().integer().min(1).max(4294967295),
    token: Joi.string(),
    last_access: Joi.number().integer().min(1).max(4294967295),
  }),
  meta: shared.meta,
})

exports.DELETE = Joi.object({})

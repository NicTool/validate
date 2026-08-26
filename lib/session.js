import Joi from 'joi'

import * as shared from './shared.js'
import * as group from './group.js'
import * as permission from './permission.js'
import * as user from './user.js'

export const id = shared.uint32
export const qualifiedUsername = Joi.string().custom((value, helpers) => {
  const separator = value.indexOf('@')
  if (separator === -1) {
    return user.username.validate(value).error ? helpers.error('any.invalid') : value
  }

  const username = value.slice(0, separator)
  const groupName = value.slice(separator + 1)
  if (user.username.validate(username).error || group.name.validate(groupName).error) {
    return helpers.error('any.invalid')
  }
  return value
})

export const POST = Joi.object({
  username: qualifiedUsername.required(),
  password: Joi.string().min(1).required(),
})

export const GET_res = Joi.object({
  user: user.v3,
  group: group.v3,
  session: Joi.object({
    id: Joi.number().integer().min(1).max(4294967295),
    token: Joi.string(),
    last_access: Joi.number().integer().min(1).max(4294967295),
  }),
  permissions: permission.v3,
  meta: shared.meta,
})

export const DELETE = Joi.object({})

import Joi from 'joi'

import * as shared from './shared.js'
import * as group from './group.js'
import * as user from './user.js'

export const id = shared.uint32

export const POST = Joi.object({
  username: user.username.required(),
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
  meta: shared.meta,
})

export const DELETE = Joi.object({})

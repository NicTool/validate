import Joi from 'joi'
import { joiPasswordExtendCore } from 'joi-password'
const JoiPassword = Joi.extend(joiPasswordExtendCore)

import * as shared from './shared.js'
import * as group from './group.js'

export const id = Joi.number().integer().min(1).max(4294967295)

export const username = Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z0-9 _.@-]+$', ''))

export const password = JoiPassword.string()
  .min(8)
  .max(30)
  .minOfSpecialCharacters(2)
  .minOfLowercase(2)
  .minOfUppercase(2)
  .minOfNumeric(2)
  .doesNotInclude(['password', 'abc', '123', 'asdf'])

export const email = Joi.string().lowercase().email({ minDomainSegments: 2 })

// v3 API response
export const v3 = Joi.object({
  id: id,
  first_name: Joi.string().min(1),
  last_name: Joi.string().min(1),
  username: username,
  email: email,
  password: password,
  is_admin: Joi.boolean(),
  deleted: Joi.boolean(),
})

export const GET_req = Joi.object({
  id: id,
  gid: group.id,
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  user: Joi.array().items(v3),
  group: Joi.object({
    id: group.id,
    name: group.name,
  }),
  meta: shared.meta,
})

export const POST = Joi.object({
  id: id,
  gid: group.id,
  first_name: Joi.string().min(1),
  last_name: Joi.string().min(1),
  username: username,
  email: email,
  password: password,
  is_admin: Joi.boolean(),
})

export const PUT = Joi.object({
  first_name: Joi.string().min(1),
  last_name: Joi.string().min(1),
  username: username,
  email: email,
  password: password,
  is_admin: Joi.boolean(),
  deleted: Joi.boolean(),
})

export const DELETE = Joi.object({
  id: id,
})

export const v2 = Joi.object({
  nt_user_id: id,
  nt_group_id: group.id,

  first_name: Joi.string().min(1),
  last_name: Joi.string().min(1),
  email: email,
  username: username,
  password: password,

  is_admin: Joi.number().min(0).max(1),
  deleted: Joi.number().min(0).max(1),

  // nt_user_session: Joi.string(),
  // last_access: Joi.string(),
})

import Joi from 'joi'

import * as shared from './shared.js'
import * as permission from './permission.js'

export const id = Joi.number().integer().min(1).max(4294967295)

export const pid = shared.uint32

export const name = Joi.string()
  .min(3)
  .max(255)
  .pattern(new RegExp("^[a-zA-Z0-9 _.@'-]+$"))
  .pattern(new RegExp('^[a-zA-Z0-9]'))

export const v3 = Joi.object({
  id: id,
  parent_gid: pid,
  name: name.required(),
  deleted: Joi.boolean(),
  has_children: Joi.boolean(),
  permission: permission.v3,
})

// legacy group format
export const v2 = Joi.object({
  nt_group_id: id,
  parent_group_id: pid,
  name: name.required(),
  deleted: Joi.boolean(),
  has_children: Joi.boolean(),
  permission: permission.v3,
})

export const GET_req = Joi.object({
  id: pid,
  name: name,
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  group: Joi.object({
    id: pid,
    name: name,
    parent_gid: pid,
    deleted: Joi.boolean(),
  }),
  meta: shared.meta,
})

export const POST = Joi.object({
  id: id,
  name: name,
  parent_gid: pid,
  deleted: Joi.boolean(),
})

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

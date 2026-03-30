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
  usable_ns: Joi.array().items(shared.uint32),
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
  include_subgroups: Joi.boolean(),
})

const groupItem = Joi.object({
  id: pid,
  name: name,
  parent_gid: pid,
  deleted: Joi.boolean(),
  permissions: permission.v3,
})

export const GET_res = Joi.object({
  group: Joi.alternatives().try(groupItem, Joi.array().items(groupItem)),
  meta: shared.meta,
})

export const GET_list_req = Joi.object({
  parent_gid: pid,
  name: name,
  deleted: Joi.boolean(),
  include_subgroups: Joi.boolean(),
})

export const GET_list_res = Joi.object({
  group: Joi.array().items(
    Joi.object({
      id: pid,
      name: name,
      parent_gid: pid,
      deleted: Joi.boolean(),
      permissions: permission.v3,
    }),
  ),
  meta: shared.meta,
})

export const GET_list_req = Joi.object({
  parent_gid: pid,
  name: name,
  deleted: Joi.boolean(),
})

export const GET_list_res = Joi.object({
  group: Joi.array().items(
    Joi.object({
      id: pid,
      name: name,
      parent_gid: pid,
      deleted: Joi.boolean(),
    }),
  ),
  meta: shared.meta,
})

export const POST = Joi.object({
  id: id,
  name: name,
  parent_gid: pid,
  deleted: Joi.boolean(),
  usable_ns: Joi.array().items(shared.uint32),
})

export const PUT = Joi.object({
  name: name,
  parent_gid: pid,
  deleted: Joi.boolean(),
  usable_ns: Joi.array().items(shared.uint32),
})

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

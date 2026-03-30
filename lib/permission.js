import Joi from 'joi'

import * as shared from './shared.js'

export const id = Joi.number().integer().min(0).max(4294967295)

export const v3 = Joi.object({
  id: id,
  name: Joi.string().allow('', null),
  inherit: Joi.boolean().allow(null),
  self_write: Joi.boolean(),
  deleted: Joi.boolean(),
  group: Joi.object({
    id: id,
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
  }),
  user: Joi.object({
    id: id.allow(null),
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
  }),
  nameserver: Joi.object({
    usable: Joi.array().items(Joi.number().integer().min(0)),
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
  }),
  zone: Joi.object({
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
    delegate: Joi.boolean(),
  }),
  zonerecord: Joi.object({
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
    delegate: Joi.boolean(),
  }),
})

export const POST = v3

export const GET_req = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  permission: v3,
  meta: shared.meta,
})

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

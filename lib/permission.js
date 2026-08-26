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

const flatBool = Joi.boolean()

export const flatFields = {
  group_write: flatBool,
  group_create: flatBool,
  group_delete: flatBool,
  zone_write: flatBool,
  zone_create: flatBool,
  zone_delegate: flatBool,
  zone_delete: flatBool,
  zonerecord_write: flatBool,
  zonerecord_create: flatBool,
  zonerecord_delegate: flatBool,
  zonerecord_delete: flatBool,
  user_write: flatBool,
  user_create: flatBool,
  user_delete: flatBool,
  nameserver_write: flatBool,
  nameserver_create: flatBool,
  nameserver_delete: flatBool,
  self_write: flatBool,
  usable_ns: Joi.array().items(Joi.number().integer().min(1)),
}

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

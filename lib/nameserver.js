import Joi from 'joi'

import * as shared from './shared.js'

export const id = shared.uint16.min(0)

export const name = Joi.string()
  .min(2)
  .max(127)
  .domain({ allowFullyQualified: true, tlds: false })
  .pattern(/\.$/)

export const type = Joi.string().valid('bind', 'djbdns', 'knot', 'nsd', 'maradns', 'powerdns', 'dynect')

export const remote_login = Joi.string().empty('').max(127)

export const v3 = Joi.object({
  id: id,
  gid: shared.uint32.required(),
  name: name.required(),
  ttl: shared.ttl.required(),
  description: Joi.string().empty('').max(255),
  address: shared.ipv4.required(),
  address6: shared.ipv6.empty(''),
  remote_login: remote_login,
  logdir: Joi.string().empty('').max(255),
  datadir: Joi.string().empty('').min(2).max(255),
  export: Joi.object({
    interval: shared.uint16,
    serials: Joi.boolean(),
    status: Joi.string().empty('').max(255),
    type: type.required(),
  }),
  deleted: Joi.boolean(),
})

export const GET_req = Joi.object({
  id: id,
  name: name,
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  nameserver: Joi.array().items(v3),
  meta: shared.meta,
})

export const POST = v3

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

import Joi from 'joi'

import * as shared from './shared.js'

export const id = shared.uint32

export const zone = Joi.string().min(3).max(255)
// .domain({ allowFullyQualified: true, allowUnderscore: true, tlds: false })

export const v3 = Joi.object({
  id: id,

  gid: shared.uint32.required(),

  zone: zone.required(),

  description: Joi.string().empty(''),

  mailaddr: Joi.string().empty(''),

  minimum: shared.int32.required(),

  nameservers: Joi.array().items(Joi.string()),

  refresh: shared.int32.required(),

  retry: shared.int32.required(),

  expire: shared.int32.required(),

  serial: shared.int32.required(),

  ttl: shared.ttl.required(),

  last_modified: Joi.date(),

  last_publish: Joi.date().allow('0000-00-00 00:00:00', '', null),

  deleted: Joi.boolean(),
})

export const GET_req = Joi.object({
  id: id,
  zone: zone,
  search: Joi.string().max(255).allow(''),
  zone_like: Joi.string().max(255).allow(''),
  description_like: Joi.string().max(255).allow(''),
  limit: shared.uint32,
  offset: shared.uint32,
  sort_by: Joi.string().valid('id', 'zone', 'description', 'last_modified'),
  sort_dir: Joi.string().lowercase().valid('asc', 'desc'),
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  zone: Joi.array().items(v3),
  meta: shared.meta,
})

export const POST = v3

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

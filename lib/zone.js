const Joi = require('joi')

const shared = require('./shared')

exports.id = shared.uint32

exports.zone = Joi.string()
    .min(3)
    .max(255)
    .domain({ allowFullyQualified: true, tlds: false })
    .required()

exports.v3 = Joi.object({
  id: exports.id,

  gid: shared.uint32.required(),

  zone: exports.zone,

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

  last_publish: Joi.date().allow('', null),

  deleted: Joi.boolean(),
})

exports.GET_req = Joi.object({
  id: exports.id,
  zone: exports.zone,
  deleted: Joi.boolean(),
})

exports.GET_res = Joi.object({
  zone: Joi.array().items(exports.v3),
  meta: shared.meta,
})

exports.POST = exports.v3

exports.DELETE = Joi.object({
  id: exports.id,
  deleted: Joi.boolean(),
})

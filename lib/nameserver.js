const Joi = require('joi')

const shared = require('./shared')

exports.id = shared.uint16.min(0)

exports.name = Joi.string()
  .min(2)
  .max(127)
  .domain({ allowFullyQualified: true, tlds: false })
  .pattern(/\.$/)

exports.type = Joi.string().valid(
  'bind',
  'djbdns',
  'knot',
  'NSD',
  'maradns',
  'powerdns',
  'dynect',
)

exports.remote_login = Joi.string().empty('').max(127)

exports.v3 = Joi.object({
  id: exports.id,
  gid: shared.uint32.required(),
  name: exports.name.required(),
  ttl: shared.ttl.required(),
  description: Joi.string().empty('').max(255),
  address: shared.ipv4.required(),
  address6: shared.ipv6.empty(''),
  remote_login: exports.remote_login,
  logdir: Joi.string().empty('').max(255),
  datadir: Joi.string().empty('').min(2).max(255),
  export: Joi.object({
    interval: shared.uint16,
    serials: Joi.boolean(),
    status: Joi.string().empty('').max(255),
    type: exports.type.required(),
  }),
  deleted: Joi.boolean(),
})

exports.GET_req = Joi.object({
  id: exports.id,
  name: exports.name,
  deleted: Joi.boolean(),
})

exports.GET_res = Joi.object({
  nameserver: Joi.array().items(exports.v3),
  meta: shared.meta,
})

exports.POST = exports.v3

exports.DELETE = Joi.object({
  id: exports.id,
  deleted: Joi.boolean(),
})

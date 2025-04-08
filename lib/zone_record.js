const Joi = require('joi')

const shared = require('./shared')

exports.id = shared.uint32.min(1).required()

exports.owner = Joi.string()
    .min(1)
    .max(255)
    .domain({ minDomainSegments: 1, allowFullyQualified: false, tlds: false })
    .required()

exports.v3 = Joi.object({
  id: exports.id,

  zid: shared.uint32.min(1).required(),

  owner: exports.owner,

  ttl: shared.ttl.required(),

  type: Joi.string()
    .valid('A', 'AAAA', 'PTR', 'MX', 'NS', 'CNAME', 'SRV')
    .required(),

  address: Joi.string()
    .ip({ version: ['ipv4'], cidr: 'forbidden' })
    .min(7)
    .max(15)
    .required(),

  deleted: Joi.boolean(),
})

exports.GET_req = Joi.object({
  id: shared.uint32,
  zid: shared.uint32,
  deleted: Joi.boolean(),
})

exports.GET_res = Joi.object({
  zone_record: Joi.array().items(exports.v3),
  meta: shared.meta,
})

exports.POST = exports.v3

exports.DELETE = Joi.object({
  id: exports.id,
  deleted: Joi.boolean(),
})
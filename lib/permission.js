const Joi = require('joi')

const shared = require('./shared')

exports.id = Joi.number().integer().min(1).max(4294967295)

exports.v3 = Joi.object({
  id: exports.id,
  name: Joi.string().empty(''),
  inherit: Joi.boolean(),
  self_write: Joi.boolean(),
  deleted: Joi.boolean(),
  group: Joi.object({
    id: exports.id,
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
  }),
  user: Joi.object({
    id: exports.id,
    write: Joi.boolean(),
    create: Joi.boolean(),
    delete: Joi.boolean(),
  }),
  nameserver: Joi.object({
    usable: Joi.array().items(Joi.number().integer().positive()),
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

exports.POST = exports.v3

exports.GET_req = Joi.object({
  id: exports.id,
  deleted: Joi.boolean(),
})

exports.GET_res = Joi.object({
  permission: exports.v3,
  meta: shared.meta,
})

exports.DELETE = Joi.object({
  id: exports.id,
  deleted: Joi.boolean(),
})

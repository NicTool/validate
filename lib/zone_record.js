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
    .valid(
      'A',
      'AAAA',
      'CAA',
      'CERT',
      'CNAME',
      'DNAME',
      'DNSKEY',
      'DS',
      'HINFO',
      'HTTPS',
      'IPSECKEY',
      'KEY',
      'LOC',
      'MX',
      'NAPTR',
      'NS',
      'NSEC',
      'NSEC3',
      'NSEC3PARAM',
      'NXT',
      'OPENPGPKEY',
      'PTR',
      'RRSIG',
      'SIG',
      'SMIMEA',
      'SOA',
      'SPF',
      'SRV',
      'SSHFP',
      'SVCB',
      'TLSA',
      'TSIG',
      'TXT',
      'URI',
      'WKS',
    )
    .required(),

  address: Joi.string().min(2).max(39),

  cname: Joi.string(),

  data: Joi.string(),

  description: Joi.string().empty(''),

  dname: Joi.string(),

  exchange: Joi.string(),

  fingerprint: Joi.string(),

  flags: [Joi.number(), Joi.string().empty('')],

  gateway: Joi.string().empty(''),

  'gateway type': Joi.string().empty(''),

  location: Joi.string().empty(''),

  order: shared.uint16,

  other: Joi.string().empty(''),

  port: shared.uint16,

  precedence: shared.uint8,

  preference: shared.uint16,

  priority: shared.uint16,

  publickey: Joi.string().empty(''),

  regexp: Joi.string().empty(''),

  replacement: Joi.string().empty(''),

  service: [Joi.number(), Joi.string().empty('')],

  tag: Joi.string(),

  target: Joi.string(),

  weight: shared.uint16,

  value: Joi.string(),

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

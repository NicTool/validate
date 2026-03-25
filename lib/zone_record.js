import Joi from 'joi'

import * as shared from './shared.js'

export const id = shared.uint32.min(1).required()

export const owner = Joi.string()
  .min(1)
  .max(255)
  // .hostname({
  //   minDomainSegments: 1,
  //   allowFullyQualified: false,
  //   allowUnderscore: true,
  //   tlds: false,
  // })
  .required()

export const v3 = Joi.object({
  id: id,

  zid: shared.uint32.min(1).required(),

  owner: owner,

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

  algorithm: Joi.number().integer().min(0).max(255),

  'algorithm name': Joi.string().empty(''),

  'apl rdata': Joi.string().empty(''),

  'bit map': Joi.string().empty(''),

  certificate: Joi.string().empty(''),

  'certificate association data': Joi.string().empty(''),

  'certificate usage': [Joi.number(), Joi.string().empty('')],

  'cert type': [Joi.number(), Joi.string().empty('')],

  cpu: Joi.string(),

  cname: Joi.string(),

  data: Joi.string(),

  digest: Joi.string().empty(''),

  'digest type': [Joi.number(), Joi.string().empty('')],

  description: Joi.string().empty(''),

  dname: Joi.string(),

  error: [Joi.number(), Joi.string().empty('')],

  expire: [Joi.number(), Joi.string().empty('')],

  exchange: Joi.string(),

  exchanger: Joi.string().empty(''),

  fingerprint: Joi.string(),

  flags: [Joi.number(), Joi.string().empty('')],

  fptype: [Joi.number(), Joi.string().empty('')],

  fudge: [Joi.number(), Joi.string().empty('')],

  gateway: Joi.string().empty(''),

  'gateway type': Joi.number().empty(''),

  'hash algorithm': [Joi.number(), Joi.string().empty('')],

  hit: Joi.string().empty(''),

  iterations: [Joi.number(), Joi.string().empty('')],

  'key tag': [Joi.number(), Joi.string().empty('')],

  labels: [Joi.number(), Joi.string().empty('')],

  location: Joi.string().empty(''),

  mac: Joi.string().empty(''),

  mbox: Joi.string().empty(''),

  'matching type': [Joi.number(), Joi.string().empty('')],

  mname: Joi.string().empty(''),

  minimum: [Joi.number(), Joi.string().empty('')],

  'next domain': Joi.string().empty(''),

  'next hashed owner name': Joi.string().empty(''),

  order: shared.uint16,

  'original id': [Joi.number(), Joi.string().empty('')],

  'original ttl': [Joi.number(), Joi.string().empty('')],

  os: Joi.string(),

  other: Joi.string().empty(''),

  params: Joi.string().empty(''),

  'pk algorithm': [Joi.number(), Joi.string().empty('')],

  port: shared.uint16,

  precedence: shared.uint8,

  preference: shared.uint16,

  priority: shared.uint16,

  protocol: [Joi.number(), Joi.string().empty('')],

  'public key': Joi.string().empty(''),

  publickey: Joi.string().empty(''),

  refresh: [Joi.number(), Joi.string().empty('')],

  regexp: Joi.string().empty(''),

  'rendezvous servers': Joi.string().empty(''),

  replacement: Joi.string().empty(''),

  retry: [Joi.number(), Joi.string().empty('')],

  rname: Joi.string().empty(''),

  salt: Joi.string().empty(''),

  selector: [Joi.number(), Joi.string().empty('')],

  serial: [Joi.number(), Joi.string().empty('')],

  service: [Joi.number(), Joi.string().empty('')],

  signature: Joi.string().empty(''),

  'signature expiration': [Joi.number(), Joi.string().empty('')],

  'signature inception': [Joi.number(), Joi.string().empty('')],

  'signers name': Joi.string().empty(''),

  tag: Joi.string(),

  target: Joi.string(),

  'target name': Joi.string().empty(''),

  'time signed': [Joi.number(), Joi.string().empty('')],

  timestamp: Joi.date(),

  txt: Joi.string().empty(''),

  'type bit map': Joi.string().empty(''),

  'type bit maps': Joi.string().empty(''),

  'type covered': Joi.string().empty(''),

  weight: shared.uint16,

  value: Joi.string(),

  deleted: Joi.boolean(),
})

export const GET_req = Joi.object({
  id: shared.uint32,
  zid: shared.uint32,
  deleted: Joi.boolean(),
})

export const GET_res = Joi.object({
  zone_record: Joi.array().items(v3),
  meta: shared.meta,
})

export const POST = v3.fork(['id', 'ttl'], (schema) => schema.optional())

export const DELETE = Joi.object({
  deleted: Joi.boolean(),
})

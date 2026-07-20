import Joi from 'joi'

import * as shared from './shared.js'

export const id = shared.uint16.min(0)

export const name = Joi.string()
  .min(2)
  .max(127)
  .domain({ allowFullyQualified: true, tlds: false })
  .pattern(/\.$/)

export const type = Joi.string().valid(
  'bind',
  'djbdns',
  'knot',
  'nsd',
  'maradns',
  'powerdns',
  'dynect',
  'native',
)

export const remote_login = Joi.string().empty('').max(127)

// --- Runtime configuration: listen sockets, publisher, transport, dnssec ---

export const listen = Joi.array().items(
  Joi.object({
    address: Joi.alternatives(shared.ipv4, shared.ipv6).required(),
    port: shared.uint16.min(1).required(),
    proto: Joi.string().valid('udp', 'tcp').default('udp'),
  }),
)

export const publisher = Joi.object({
  type: Joi.string()
    .valid('memory', 'rfc1035', 'tinydns-cdb', 'powerdns-db')
    .required(),
  path: Joi.string().empty('').max(1024),
  database: Joi.string().empty('').max(255),
}).unknown(true)

export const transport = Joi.object({
  type: Joi.string()
    .valid('noop', 'axfr', 'rsync', 'db-replication')
    .required(),
  interval: shared.uint32.default(300),
  cooldown: shared.uint16.default(5),
  master: Joi.string().empty('').max(255),
  tsig_key: Joi.string().empty('').max(255),
  remote: Joi.string().empty('').max(255),
  ssh_key: Joi.string().empty('').max(1024),
}).unknown(true)

export const dnssec = Joi.object({
  enabled: Joi.boolean().default(false),
  algorithm: Joi.string().valid(
    'RSASHA256',
    'RSASHA512',
    'ECDSAP256SHA256',
    'ECDSAP384SHA384',
    'ED25519',
    'ED448',
  ),
  keyset: Joi.string().empty('').max(1024),
  nsec3: Joi.boolean().default(false),
})

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
  engine: type,
  listen: listen,
  publisher: publisher,
  transport: transport,
  dnssec: dnssec,
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
  gid: shared.uint32,
  deleted: Joi.boolean(),
})

export const POST = v3

export const PUT = Joi.object({
  name: name,
  ttl: shared.ttl,
  description: Joi.string().empty('').max(255),
  address: shared.ipv4,
  address6: shared.ipv6.empty(''),
  remote_login: remote_login,
  engine: type,
  listen: listen,
  publisher: publisher,
  transport: transport,
  dnssec: dnssec,
  export: Joi.object({
    interval: shared.uint16,
    serials: Joi.boolean(),
    status: Joi.string().empty('').max(255),
    type: type,
  }),
  deleted: Joi.boolean(),
})

export const DELETE = Joi.object({
  id: id,
  deleted: Joi.boolean(),
})

// GET_res uses a looser name check so records with legacy/missing trailing dots
// don't fail the entire response.
const v3_out = v3
  .fork(['name'], () => Joi.string().min(1).max(255).allow(''))
  .fork(['address'], () => shared.ipv4.allow('').optional())
  .fork(['gid', 'ttl'], (s) => s.optional())

export const GET_res = Joi.object({
  nameserver: Joi.array().items(v3_out),
  meta: shared.meta,
})

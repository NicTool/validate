import Joi from 'joi'

import * as shared from './shared.js'

export const id = shared.uint16.min(0)

export const name = Joi.string()
  .min(2)
  .max(127)
  .domain({ allowFullyQualified: true, tlds: false })
  .pattern(/\.$/)

/**
 * Which nameserver software this is — the `nt_nameserver_export_type` names,
 * which is also what NameserverSupervisor dispatches on.
 */
export const BUILDABLE = [
  'bind',
  'djbdns',
  'knot',
  'nsd',
  'maradns',
  'powerdns',
  'native',
  'coredns',
]

/**
 * 2.x export types that name how a nameserver is fed rather than a different
 * nameserver, resolved to the type that implements them.
 *
 *   bind-nsupdate  BIND fed over the network (RFC 2136) instead of by file
 *                  copy. 2.x made that an export type of its own; v3 makes it
 *                  a transport choice, so the nameserver is just bind.
 */
export const ALIASES = { 'bind-nsupdate': 'bind' }

/**
 * A type a 2.x install can hold that nothing here implements. Storing one is
 * allowed — an adopted 2.x record must survive a round trip through the API —
 * but the supervisor refuses to start it rather than inventing a substitute.
 */
export const UNBUILDABLE = ['dynect']

/** The canonical spelling for a stored type, which may be a 2.x alias. */
export const resolveType = (value) => ALIASES[value] ?? value

export const type = Joi.string().valid(...BUILDABLE, ...Object.keys(ALIASES), ...UNBUILDABLE)

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
    .valid('memory', 'rfc1035', 'maradns', 'tinydns-cdb', 'powerdns-db', 'coredns-redis', 'none')
    .required(),
  path: Joi.string().empty('').max(1024),
  database: Joi.string().empty('').max(255),
}).unknown(true)

// these objects are stored as JSON and read by the dns-nameserver classes
export const transport = Joi.object({
  type: Joi.string().valid('noop', 'axfr', 'rsync', 'db-replication', 'pull').required(),
  // pull: free text naming how the far side fetches, e.g. "fetchzone from cron"
  source: Joi.string().empty('').max(255),
  interval: shared.uint32.default(300),
  cooldown: shared.uint16.default(5),
  // axfr: who to NOTIFY. "host", "host:port" and "[v6]:port" all parse.
  notify: Joi.array().items(Joi.string().max(255)),
  master: Joi.string().empty('').max(255),
  tsigKey: Joi.string().empty('').max(255),
  port: shared.uint16.min(1),
  timeoutMs: shared.uint32,
  attempts: shared.uint16.min(1),
  remote: Joi.string().empty('').max(255),
  sshKey: Joi.string().empty('').max(1024),
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
  type: type.required(),
  listen: listen,
  publisher: publisher,
  transport: transport,
  dnssec: dnssec,
  export: Joi.object({
    interval: shared.uint16,
    serials: Joi.boolean(),
    status: Joi.string().empty('').max(255),
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
  type: type,
  listen: listen,
  publisher: publisher,
  transport: transport,
  dnssec: dnssec,
  export: Joi.object({
    interval: shared.uint16,
    serials: Joi.boolean(),
    status: Joi.string().empty('').max(255),
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

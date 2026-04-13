import Joi from 'joi'

import * as shared from './shared.js'

const objectType = Joi.string().valid('ZONE', 'ZONERECORD', 'NAMESERVER', 'GROUP')

const permBool = Joi.boolean().default(true)

const delegationPerms = {
  perm_write: permBool,
  perm_delete: permBool,
  perm_delegate: permBool,
  zone_perm_add_records: permBool,
  zone_perm_delete_records: permBool,
}

const delegationObj = Joi.object({
  nt_group_id: shared.uint32,
  nt_object_id: shared.uint32,
  nt_object_type: objectType,
  group_name: Joi.string().allow('', null),
  delegated_by_id: shared.uint32.allow(null),
  delegated_by_name: Joi.string().allow('', null),

  delegate_write: Joi.number().integer().min(0).max(1),
  delegate_delete: Joi.number().integer().min(0).max(1),
  delegate_delegate: Joi.number().integer().min(0).max(1),
  delegate_add_records: Joi.number().integer().min(0).max(1),
  delegate_delete_records: Joi.number().integer().min(0).max(1),

  // zone fields from JOIN (when type=ZONE)
  nt_zone_id: shared.uint32,
  zone: Joi.string().allow('', null),
  description: Joi.string().allow('', null),

  // zone record fields from JOIN (when type=ZONERECORD)
  nt_zone_record_id: shared.uint32,
}).unknown(true)

export const POST = Joi.object({
  gid: shared.uint32.required(),
  oid: shared.uint32.required(),
  type: objectType.required(),
  delegated_by_id: shared.uint32,
  delegated_by_name: Joi.string().max(50),
  ...delegationPerms,
})

export const GET_req = Joi.object({
  gid: shared.uint32,
  oid: shared.uint32,
  type: objectType,
})

export const GET_res = Joi.object({
  delegation: Joi.array().items(delegationObj),
  meta: shared.meta,
})

export const PUT = Joi.object({
  gid: shared.uint32.required(),
  oid: shared.uint32.required(),
  type: objectType.required(),
  perm_write: Joi.boolean(),
  perm_delete: Joi.boolean(),
  perm_delegate: Joi.boolean(),
  zone_perm_add_records: Joi.boolean(),
  zone_perm_delete_records: Joi.boolean(),
})

export const DELETE = Joi.object({
  gid: shared.uint32.required(),
  oid: shared.uint32.required(),
  type: objectType.required(),
})

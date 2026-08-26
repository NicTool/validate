import Joi from 'joi'

import * as shared from './shared.js'

const id = shared.uint32.min(1)

const listControls = {
  search: Joi.string().max(255).allow(''),
  exact_match: Joi.boolean(),
  limit: shared.uint32.min(1),
  offset: shared.uint32,
  sort_dir: Joi.string().lowercase().valid('asc', 'desc'),
}

const groupScope = {
  gid: id,
  include_subgroups: Joi.boolean(),
}

export const GET_global_req = Joi.object({
  ...groupScope,
  uid: id,
  ...listControls,
  sort_by: Joi.string().valid(
    'timestamp',
    'user',
    'action',
    'object',
    'title',
    'description',
    'group_name',
  ),
})

export const GET_zone_req = Joi.object({
  ...groupScope,
  ...listControls,
  sort_by: Joi.string().valid(
    'timestamp',
    'user',
    'action',
    'zone',
    'ttl',
    'description',
    'group_name',
  ),
})

export const GET_zone_record_req = Joi.object({
  id,
  zid: id.required(),
  ...listControls,
  sort_by: Joi.string().valid(
    'timestamp',
    'user',
    'action',
    'owner',
    'type',
    'address',
    'ttl',
    'weight',
    'description',
  ),
})

export const GET_req = Joi.object({
  id,
  gid: id,
  zid: id,
  uid: id,
  include_subgroups: Joi.boolean(),
  ...listControls,
  sort_by: Joi.string().valid(
    'timestamp',
    'user',
    'action',
    'object',
    'title',
    'description',
    'zone',
    'ttl',
    'group_name',
    'owner',
    'type',
    'address',
    'weight',
  ),
})

const entry = Joi.object({
  id: id.required(),
  uid: id.required(),
  action: Joi.string()
    .valid(
      'added',
      'deleted',
      'modified',
      'moved',
      'recovered',
      'delegated',
      'modified delegation',
      'removed delegation',
    )
    .required(),
  timestamp: shared.uint32.required(),
  user: Joi.string().allow('', null),
}).unknown()

export const GET_res = Joi.object({
  log: Joi.array().items(entry).required(),
  meta: shared.meta,
})

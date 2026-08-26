import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import * as log from './log.js'

describe('log validation', () => {
  it('accepts scoped list controls', () => {
    const query = {
      id: 7,
      gid: 2,
      zid: 3,
      include_subgroups: true,
      search: 'changed',
      exact_match: false,
      limit: 50,
      offset: 10,
      sort_by: 'timestamp',
      sort_dir: 'desc',
    }
    const { error, value } = log.GET_req.validate(query)
    assert.equal(error, undefined)
    assert.deepEqual(value, query)
  })

  it('rejects unbounded and invalid list controls', () => {
    for (const query of [
      { gid: -1 },
      { limit: 0 },
      { limit: -1 },
      { sort_by: 'sql_fragment' },
      { sort_dir: 'sideways' },
    ]) {
      assert.ok(log.GET_req.validate(query).error)
    }
  })

  it('accepts a large limit', () => {
    const { error } = log.GET_req.validate({ gid: 2, limit: 1000 })
    assert.ifError(error)
  })

  it('requires a zone for zone-record audit queries', () => {
    assert.ok(log.GET_zone_record_req.validate({}).error)
    assert.ifError(log.GET_zone_record_req.validate({ zid: 3 }).error)
  })

  it('limits sorting to fields supported by each audit route', () => {
    assert.ifError(log.GET_global_req.validate({ sort_by: 'group_name' }).error)
    assert.ok(log.GET_global_req.validate({ sort_by: 'zone' }).error)

    assert.ifError(log.GET_zone_req.validate({ sort_by: 'zone' }).error)
    assert.ok(log.GET_zone_req.validate({ sort_by: 'object' }).error)

    assert.ifError(log.GET_zone_record_req.validate({ zid: 3, sort_by: 'owner' }).error)
    assert.ok(log.GET_zone_record_req.validate({ zid: 3, sort_by: 'group_name' }).error)
  })

  it('accepts heterogeneous audit entries', () => {
    const result = {
      log: [
        {
          id: 7,
          uid: 2,
          action: 'deleted',
          timestamp: 123456,
          zid: 9,
          zone: 'example.test.',
        },
      ],
      meta: {
        msg: 'audit entries',
        pagination: { total: 1, filtered: 1, limit: 50, offset: 0 },
      },
    }
    assert.equal(log.GET_res.validate(result).error, undefined)
  })
})

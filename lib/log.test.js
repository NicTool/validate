import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import * as log from './log.js'

describe('log validation', () => {
  it('accepts scoped list controls', () => {
    const query = {
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
      { limit: 256 },
      { sort_by: 'sql_fragment' },
      { sort_dir: 'sideways' },
    ]) {
      assert.ok(log.GET_req.validate(query).error)
    }
  })

  it('accepts heterogeneous audit entries', () => {
    const result = {
      log: [{
        id: 7,
        uid: 2,
        action: 'deleted',
        timestamp: 123456,
        zid: 9,
        zone: 'example.test.',
      }],
      meta: {
        msg: 'audit entries',
        pagination: { total: 1, filtered: 1, limit: 50, offset: 0 },
      },
    }
    assert.equal(log.GET_res.validate(result).error, undefined)
  })
})

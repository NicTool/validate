import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { describe, it } from 'node:test'

import * as group from './group.js'
import * as nameserver from './nameserver.js'
import * as permission from './permission.js'
import * as user from './user.js'
import * as zone from './zone.js'
import * as zoneRecord from './zone_record.js'

const require = createRequire(import.meta.url)

const groupFixture = structuredClone(require('./test/group.json'))
delete groupFixture.has_children
const userFixture = structuredClone(require('./test/user.json'))
delete userFixture.deleted

const cases = [
  ['group', group.POST, groupFixture],
  ['nameserver', nameserver.POST, require('./test/nameserver.json')],
  ['permission', permission.POST, { id: 3, name: 'test permission' }],
  ['user', user.POST, userFixture],
  ['zone', zone.POST, require('./test/zone.json')],
  ['zone record', zoneRecord.POST, require('./test/zone_record.json')],
]

describe('create schemas', () => {
  for (const [name, schema, fixture] of cases) {
    it(`${name} accepts an omitted id and rejects a supplied id`, () => {
      const payload = structuredClone(fixture)
      delete payload.id

      assert.ifError(schema.validate(payload).error)
      assert.equal(schema.validate({ ...payload, id: 999 }).error?.message, '"id" is not allowed')
    })
  }
})

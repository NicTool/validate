import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import * as schema from './index.js'

describe('index', function () {
  const testGroup = require('./lib/test/group.json')
  const testUser = require('./lib/test/user.json')
  const testNs = require('./lib/test/nameserver.json')

  it('exports user', () => {
    const testCase = JSON.parse(JSON.stringify(testUser))
    const { error, value } = schema.user.v3.validate(testCase)
    assert.ifError(error)
    assert.deepEqual(testCase, value)
  })

  it('exports group', () => {
    const testCase = JSON.parse(JSON.stringify(testGroup))
    const { error, value } = schema.group.v3.validate(testCase)
    assert.ifError(error)
    assert.deepEqual(testCase, value)
  })

  it('exports nameserver', () => {
    const testCase = JSON.parse(JSON.stringify(testNs))
    const { error } = schema.nameserver.v3.validate(testCase)
    assert.ifError(error)
  })
})
